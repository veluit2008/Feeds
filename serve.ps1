<#
Simple local HTTP server using PowerShell (no external dependencies).
Run from the project folder:
  powershell -ExecutionPolicy Bypass -File .\serve.ps1

Then open in Chrome:
  http://localhost:8000/greenfield-feeds_copilot.html
#>

$port = 8000
$root = Get-Location

Write-Host "Serving $root on http://localhost:$port/ (Ctrl+C to stop)" -ForegroundColor Cyan

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
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
