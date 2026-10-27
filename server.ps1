param(
    [int]$Port = 3000,
    [string]$Root = $PSScriptRoot,
    [switch]$OpenBrowser
)

$ip = [System.Net.IPAddress]::Loopback
$listener = New-Object System.Net.Sockets.TcpListener($ip, $Port)

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
}

try {
    $listener.Start()
    $url = "http://localhost:$Port"
    Write-Host "=========================================================="
    Write-Host "  Portfolio Web Server is RUNNING at: $url"
    Write-Host "  Root: $Root"
    Write-Host "  Press Ctrl + C or close this window to stop."
    Write-Host "=========================================================="

    if ($OpenBrowser) {
        Start-Process $url
    }
} catch {
    Write-Host "Error binding to port $Port : $($_.Exception.Message)"
    exit 1
}

$crlf = "`r`n"

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        
        $buffer = New-Object byte[] 8192
        $bytesRead = $stream.Read($buffer, 0, $buffer.Length)
        if ($bytesRead -le 0) {
            $client.Close()
            continue
        }

        $requestText = [System.Text.Encoding]::UTF8.GetString($buffer, 0, $bytesRead)
        $firstLine = ($requestText -split "`r`n")[0]
        $parts = $firstLine -split " "
        
        if ($parts.Length -lt 2) {
            $client.Close()
            continue
        }

        $rawUrl = $parts[1]
        if ($rawUrl.Contains("?")) {
            $rawUrl = $rawUrl.Substring(0, $rawUrl.IndexOf("?"))
        }

        $urlPath = [System.Uri]::UnescapeDataString($rawUrl)
        if ($urlPath -eq "/" -or $urlPath -eq "") {
            $urlPath = "/index.html"
        }

        $cleanPath = $urlPath.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        $localPath = [System.IO.Path]::Combine($Root, $cleanPath)

        if ([System.IO.File]::Exists($localPath)) {
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $fileBytes = [System.IO.File]::ReadAllBytes($localPath)
            
            $header = "HTTP/1.1 200 OK" + $crlf +
                      "Content-Type: " + $contentType + $crlf +
                      "Content-Length: " + $fileBytes.Length + $crlf +
                      "Connection: close" + $crlf +
                      "Access-Control-Allow-Origin: *" + $crlf + $crlf
            $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
            
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($fileBytes, 0, $fileBytes.Length)
            $stream.Flush()
        } else {
            $body = "<html><head><meta charset='utf-8'><title>404</title></head><body><h2>404 Not Found</h2></body></html>"
            $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
            $header = "HTTP/1.1 404 Not Found" + $crlf +
                      "Content-Type: text/html; charset=utf-8" + $crlf +
                      "Content-Length: " + $bodyBytes.Length + $crlf +
                      "Connection: close" + $crlf + $crlf
            $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($bodyBytes, 0, $bodyBytes.Length)
            $stream.Flush()
        }

        $stream.Close()
        $client.Close()
    }
} finally {
    $listener.Stop()
}
