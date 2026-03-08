<#
Simple local HTTP server using PowerShell (no external dependencies).
Run from the project folder:
  powershell -ExecutionPolicy Bypass -File .\serve.ps1

Then open in Chrome:
  http://localhost:8000/greenfield-feeds_copilot.html
#>

$port = 8000
$root = Get-Location

# Listen on all interfaces so other devices on the same network can reach it.
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://+:$port/")
$listener.Start()

# Determine a local IP (best effort) for other devices on the same Wi‑Fi/LAN.
$localIp = (Get-NetIPAddress -AddressFamily IPv4 -PrefixOrigin Dhcp | Where-Object { $_.IPAddress -notlike '169.*' -and $_.IPAddress -notlike '127.*' } | Select-Object -First 1 -ExpandProperty IPAddress)
$localIp = $localIp -or 'localhost'

Write-Host "Serving $root" -ForegroundColor Cyan
Write-Host "  Local:  http://localhost:$port/greenfield-feeds_copilot.html"
Write-Host "  Network:  http://$localIp:$port/greenfield-feeds_copilot.html (use from phone on same Wi-Fi)" -ForegroundColor Cyan

function Get-ContentType($path) {
    switch ([System.IO.Path]::GetExtension($path).ToLower()) {
        ".html" { "text/html" }
        ".htm"  { "text/html" }
        ".js"   { "application/javascript" }
        ".css"  { "text/css" }
        ".json" { "application/json" }
        ".png"  { "image/png" }
        ".jpg"  { "image/jpeg" }
        ".jpeg" { "image/jpeg" }
        ".svg"  { "image/svg+xml" }
        ".ico"  { "image/x-icon" }
        default  { "application/octet-stream" }
    }
}

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $req = $context.Request
    $res = $context.Response

    try {
        $requested = $req.Url.AbsolutePath.TrimStart("/")
        if (-not $requested) {
            $requested = "greenfield-feeds_copilot.html"
        }

        $path = Join-Path $root $requested

        if (-not (Test-Path $path)) {
            $res.StatusCode = 404
            $res.StatusDescription = "Not Found"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $res.ContentLength64 = $buffer.Length
            $res.OutputStream.Write($buffer, 0, $buffer.Length)
            $res.Close()
            continue
        }

        $bytes = [System.IO.File]::ReadAllBytes($path)
        $res.ContentType = Get-ContentType $path
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
        $res.Close()
    } catch {
        Write-Warning "Error: $_"
        $res.StatusCode = 500
        $res.Close()
    }
}

$listener.Stop()
$listener.Close()
