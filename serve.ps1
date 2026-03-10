<#
Simple local HTTP server using PowerShell (no external dependencies).
Run from the project folder:
  powershell -ExecutionPolicy Bypass -File .\serve.ps1

Then open in Chrome:
  http://localhost:8000/greenfield-feeds_copilot.html

You can also open it from another device on the same Wi‑Fi using the printed Network URL.
#>

$port = 8001
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# Find a usable local IP for network access (best-effort).
$localIp = (Get-NetIPAddress -AddressFamily IPv4 -PrefixOrigin Dhcp | Where-Object { $_.IPAddress -notlike '169.*' -and $_.IPAddress -notlike '127.*' } | Select-Object -First 1 -ExpandProperty IPAddress)
if (-not $localIp) { $localIp = 'localhost' }

Write-Host "Serving $root" -ForegroundColor Cyan
Write-Host "  Local:   http://localhost:$port/index.html" -ForegroundColor Cyan
$networkUrl = "http://" + $localIp + ":" + $port + "/index.html"
Write-Host "  Network: $networkUrl (use from phone on same Wi-Fi)" -ForegroundColor Cyan

# Simple HTTP server (no admin rights needed)
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $port)
$listener.Start()

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

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        try {
            $stream = $client.GetStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $requestLine = $reader.ReadLine()
            if (-not $requestLine) { continue }

            $parts = $requestLine -split ' '
            if ($parts.Length -lt 2) { continue }

            $path = $parts[1].TrimStart('/')
            if (-not $path) { $path = 'index.html' }
            $filePath = Join-Path $root $path

            if (-not (Test-Path $filePath)) {
                $body = "404 Not Found"
                $response = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n$body"
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($response)
                $stream.Write($bytes, 0, $bytes.Length)
                continue
            }

            $content = [System.IO.File]::ReadAllBytes($filePath)
            $contentType = Get-ContentType $filePath
            $header = "HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $($content.Length)`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($content, 0, $content.Length)
        } catch {
            # ignore per-connection errors
        } finally {
            if ($stream) { $stream.Close() }
            $client.Close()
        }
    }
} finally {
    $listener.Stop()
}
