Add-Type -AssemblyName System.Drawing

function New-RoundPath {
    param([int]$X, [int]$Y, [int]$W, [int]$H, [int]$R)
    $p = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $R * 2
    $p.AddArc($X, $Y, $d, $d, 180, 90)
    $p.AddArc($X + $W - $d, $Y, $d, $d, 270, 90)
    $p.AddArc($X + $W - $d, $Y + $H - $d, $d, $d, 0, 90)
    $p.AddArc($X, $Y + $H - $d, $d, $d, 90, 90)
    $p.CloseFigure()
    return $p
}

function Draw-RoundRect {
    param(
        [System.Drawing.Graphics]$G,
        [int]$X, [int]$Y, [int]$W, [int]$H, [int]$R,
        [System.Drawing.Color]$Fill,
        [System.Drawing.Color]$Border
    )
    $path = New-RoundPath -X $X -Y $Y -W $W -H $H -R $R
    $fb = New-Object System.Drawing.SolidBrush($Fill)
    $bp = New-Object System.Drawing.Pen($Border, 2)
    $G.FillPath($fb, $path)
    $G.DrawPath($bp, $path)
    $fb.Dispose()
    $bp.Dispose()
    $path.Dispose()
}

function Draw-TextRect {
    param(
        [System.Drawing.Graphics]$G,
        [string]$Text,
        [System.Drawing.Font]$Font,
        [System.Drawing.Brush]$Brush,
        [float]$X, [float]$Y, [float]$W, [float]$H,
        [string]$Align = "Near"
    )
    $fmt = New-Object System.Drawing.StringFormat
    if ($Align -eq "Center") {
        $fmt.Alignment = [System.Drawing.StringAlignment]::Center
    } else {
        $fmt.Alignment = [System.Drawing.StringAlignment]::Near
    }
    $fmt.LineAlignment = [System.Drawing.StringAlignment]::Near
    $fmt.Trimming = [System.Drawing.StringTrimming]::Word
    $rect = New-Object System.Drawing.RectangleF($X, $Y, $W, $H)
    $G.DrawString($Text, $Font, $Brush, $rect, $fmt)
    $fmt.Dispose()
}

$w = 1700
$h = 2400
$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

$bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Rectangle(0, 0, $w, $h)),
    [System.Drawing.Color]::FromArgb(250, 245, 239),
    [System.Drawing.Color]::FromArgb(241, 247, 255),
    90
)
$g.FillRectangle($bg, 0, 0, $w, $h)
$bg.Dispose()

$outerX = 55
$outerY = 35
$outerW = 1590
$outerH = 2320
Draw-RoundRect -G $g -X $outerX -Y $outerY -W $outerW -H $outerH -R 28 `
    -Fill ([System.Drawing.Color]::FromArgb(251, 252, 255)) `
    -Border ([System.Drawing.Color]::FromArgb(217, 225, 240))

$titleFont = New-Object System.Drawing.Font("Segoe UI Semibold", 58, [System.Drawing.FontStyle]::Bold)
$logoFont = New-Object System.Drawing.Font("Segoe UI Black", 88, [System.Drawing.FontStyle]::Bold)
$subLogoFont = New-Object System.Drawing.Font("Segoe UI", 30, [System.Drawing.FontStyle]::Regular)
$sectionFont = New-Object System.Drawing.Font("Segoe UI Semibold", 42, [System.Drawing.FontStyle]::Bold)
$cardHeaderFont = New-Object System.Drawing.Font("Segoe UI Semibold", 29, [System.Drawing.FontStyle]::Bold)
$bodyFont = New-Object System.Drawing.Font("Segoe UI", 24, [System.Drawing.FontStyle]::Regular)
$smallFont = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Regular)
$footerFont = New-Object System.Drawing.Font("Segoe UI Semibold", 38, [System.Drawing.FontStyle]::Bold)
$footerSub = New-Object System.Drawing.Font("Segoe UI", 30, [System.Drawing.FontStyle]::Regular)

$navy = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(18, 33, 79))
$muted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(77, 94, 136))
$white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$red = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(209, 38, 55))

# Header logo block (kept as KLU/BACHUPALLY identity area)
$ringPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(27, 43, 85), 6)
$g.DrawEllipse($ringPen, 270, 70, 130, 130)
$g.DrawEllipse($ringPen, 294, 94, 82, 82)
Draw-TextRect -G $g -Text "KLU" -Font $logoFont -Brush $red -X 430 -Y 55 -W 470 -H 120
Draw-TextRect -G $g -Text "BACHUPALLY" -Font $subLogoFont -Brush $navy -X 465 -Y 160 -W 390 -H 44

Draw-TextRect -G $g -Text "Project Based Learning - FWD" -Font $titleFont -Brush $navy -X 180 -Y 215 -W 1340 -H 90 -Align "Center"
$linePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(206, 214, 235), 3)
$g.DrawLine($linePen, 140, 330, 1560, 330)

# Top panels
$aX = 130; $aY = 370; $aW = 700; $aH = 420
$sX = 870; $sY = 370; $sW = 700; $sH = 420

Draw-RoundRect -G $g -X $aX -Y $aY -W $aW -H $aH -R 22 `
    -Fill ([System.Drawing.Color]::FromArgb(255, 250, 241)) `
    -Border ([System.Drawing.Color]::FromArgb(244, 201, 140))
Draw-RoundRect -G $g -X $aX -Y $aY -W $aW -H 78 -R 20 `
    -Fill ([System.Drawing.Color]::FromArgb(236, 136, 33)) `
    -Border ([System.Drawing.Color]::FromArgb(236, 136, 33))
Draw-TextRect -G $g -Text "Abstract" -Font $cardHeaderFont -Brush $white -X 160 -Y 393 -W 250 -H 45
$abstract = @"
Gradify is a web application where students can generate concise
study notes from topic text or questions for fast revision.

Built with HTML, CSS, JavaScript, and module-based architecture,
the project includes route navigation, async generation simulation,
markdown rendering, and copy or reset workflows.
"@
Draw-TextRect -G $g -Text $abstract -Font $bodyFont -Brush $navy -X 158 -Y 470 -W 650 -H 300

Draw-RoundRect -G $g -X $sX -Y $sY -W $sW -H $sH -R 22 `
    -Fill ([System.Drawing.Color]::FromArgb(239, 249, 246)) `
    -Border ([System.Drawing.Color]::FromArgb(147, 212, 191))
Draw-RoundRect -G $g -X $sX -Y $sY -W $sW -H 78 -R 20 `
    -Fill ([System.Drawing.Color]::FromArgb(26, 133, 110)) `
    -Border ([System.Drawing.Color]::FromArgb(26, 133, 110))
Draw-TextRect -G $g -Text "System Architecture" -Font $cardHeaderFont -Brush $white -X 932 -Y 393 -W 450 -H 45

Draw-RoundRect -G $g -X 990 -Y 490 -W 470 -H 64 -R 14 `
    -Fill ([System.Drawing.Color]::FromArgb(39, 77, 173)) `
    -Border ([System.Drawing.Color]::FromArgb(28, 60, 141))
Draw-TextRect -G $g -Text "Node.js + Express.js" -Font $smallFont -Brush $white -X 1110 -Y 509 -W 240 -H 34 -Align "Center"

Draw-RoundRect -G $g -X 900 -Y 600 -W 190 -H 120 -R 14 `
    -Fill ([System.Drawing.Color]::FromArgb(255, 233, 200)) `
    -Border ([System.Drawing.Color]::FromArgb(221, 174, 93))
Draw-TextRect -G $g -Text "Database" -Font $smallFont -Brush $navy -X 925 -Y 646 -W 160 -H 35 -Align "Center"

Draw-RoundRect -G $g -X 1125 -Y 600 -W 190 -H 120 -R 14 `
    -Fill ([System.Drawing.Color]::FromArgb(219, 239, 255)) `
    -Border ([System.Drawing.Color]::FromArgb(120, 182, 231))
Draw-TextRect -G $g -Text "Storage" -Font $smallFont -Brush $navy -X 1138 -Y 646 -W 160 -H 35 -Align "Center"

Draw-RoundRect -G $g -X 1350 -Y 600 -W 180 -H 120 -R 14 `
    -Fill ([System.Drawing.Color]::FromArgb(232, 235, 255)) `
    -Border ([System.Drawing.Color]::FromArgb(152, 158, 227))
Draw-TextRect -G $g -Text "Users" -Font $smallFont -Brush $navy -X 1360 -Y 646 -W 150 -H 35 -Align "Center"

$archPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(69, 85, 146), 3)
$g.DrawLine($archPen, 1230, 554, 995, 600)
$g.DrawLine($archPen, 1230, 554, 1220, 600)
$g.DrawLine($archPen, 1230, 554, 1440, 600)
$g.DrawLine($archPen, 995, 720, 1230, 720)
$g.DrawLine($archPen, 1230, 720, 1440, 720)

# Section title
Draw-TextRect -G $g -Text "CO-WISE IMPLEMENTATION" -Font $sectionFont -Brush $navy -X 450 -Y 820 -W 800 -H 60 -Align "Center"

function Draw-COCard {
    param(
        [System.Drawing.Graphics]$G,
        [int]$X, [int]$Y, [int]$W, [int]$H,
        [string]$Header, [string]$Text,
        [System.Drawing.Color]$HColor,
        [System.Drawing.Color]$BColor,
        [System.Drawing.Color]$BrColor,
        [System.Drawing.Font]$HFont,
        [System.Drawing.Font]$BFont,
        [System.Drawing.Brush]$White,
        [System.Drawing.Brush]$Dark
    )
    Draw-RoundRect -G $G -X $X -Y $Y -W $W -H $H -R 18 -Fill $BColor -Border $BrColor
    Draw-RoundRect -G $G -X $X -Y $Y -W $W -H 58 -R 16 -Fill $HColor -Border $HColor
    Draw-TextRect -G $G -Text $Header -Font $HFont -Brush $White -X ($X + 18) -Y ($Y + 13) -W ($W - 36) -H 34
    Draw-TextRect -G $G -Text $Text -Font $BFont -Brush $Dark -X ($X + 18) -Y ($Y + 72) -W ($W - 34) -H ($H - 82)
}

$co1 = @"
- Responsive dashboard and feed layout
- Semantic HTML and accessible controls
- CSS layout architecture and component patterns
- Form styling and clean visual hierarchy
"@
Draw-COCard -G $g -X 130 -Y 890 -W 1440 -H 250 `
    -Header "CO1  Internet Fundamentals, HTML and Introductory CSS" `
    -Text $co1 `
    -HColor ([System.Drawing.Color]::FromArgb(71, 88, 184)) `
    -BColor ([System.Drawing.Color]::FromArgb(241, 244, 255)) `
    -BrColor ([System.Drawing.Color]::FromArgb(176, 189, 239)) `
    -HFont $smallFont -BFont $smallFont -White $white -Dark $navy

$co2 = @"
- Input validation and state guards
- Async generation workflow
- Modular JavaScript functions
"@
Draw-COCard -G $g -X 130 -Y 1170 -W 700 -H 235 `
    -Header "CO2  JavaScript Programming Essentials" `
    -Text $co2 `
    -HColor ([System.Drawing.Color]::FromArgb(227, 121, 39)) `
    -BColor ([System.Drawing.Color]::FromArgb(255, 246, 238)) `
    -BrColor ([System.Drawing.Color]::FromArgb(239, 190, 148)) `
    -HFont $smallFont -BFont $smallFont -White $white -Dark $navy

$co3 = @"
- Dynamic DOM updates and events
- Comment-like actions: copy, retry, reset
- Route transitions via hash navigation
"@
Draw-COCard -G $g -X 870 -Y 1170 -W 700 -H 235 `
    -Header "CO3  JavaScript Interactivity, DOM and Events" `
    -Text $co3 `
    -HColor ([System.Drawing.Color]::FromArgb(42, 144, 126)) `
    -BColor ([System.Drawing.Color]::FromArgb(238, 250, 247)) `
    -BrColor ([System.Drawing.Color]::FromArgb(154, 219, 205)) `
    -HFont $smallFont -BFont $smallFont -White $white -Dark $navy

$co4 = @"
- Loading, result, and error screens
- Retry and reset for safe reattempts
- Better UX through focus flow
"@
Draw-COCard -G $g -X 130 -Y 1435 -W 700 -H 235 `
    -Header "CO4  Reliability and Error Handling" `
    -Text $co4 `
    -HColor ([System.Drawing.Color]::FromArgb(203, 101, 46)) `
    -BColor ([System.Drawing.Color]::FromArgb(255, 244, 236)) `
    -BrColor ([System.Drawing.Color]::FromArgb(237, 180, 149)) `
    -HFont $smallFont -BFont $smallFont -White $white -Dark $navy

$co5 = @"
- Unit tests for generator and router
- E2E validation for note generation flow
- QA checklist and release notes readiness
"@
Draw-COCard -G $g -X 870 -Y 1435 -W 700 -H 235 `
    -Header "CO5  Advanced Web Development and Deployment" `
    -Text $co5 `
    -HColor ([System.Drawing.Color]::FromArgb(75, 85, 190)) `
    -BColor ([System.Drawing.Color]::FromArgb(241, 243, 255)) `
    -BrColor ([System.Drawing.Color]::FromArgb(177, 183, 235)) `
    -HFont $smallFont -BFont $smallFont -White $white -Dark $navy

# Conclusion panel
Draw-RoundRect -G $g -X 130 -Y 1700 -W 1440 -H 290 -R 20 `
    -Fill ([System.Drawing.Color]::FromArgb(255, 248, 230)) `
    -Border ([System.Drawing.Color]::FromArgb(242, 210, 124))
Draw-RoundRect -G $g -X 130 -Y 1700 -W 620 -H 64 -R 18 `
    -Fill ([System.Drawing.Color]::FromArgb(237, 182, 43)) `
    -Border ([System.Drawing.Color]::FromArgb(237, 182, 43))
Draw-TextRect -G $g -Text "Conclusion and Future Scope" -Font $cardHeaderFont -Brush $white -X 158 -Y 1718 -W 560 -H 38
$conclusion = @"
This project demonstrates core web development competencies in UI design,
interaction handling, and asynchronous data workflow integration.
Future scope includes real LLM backend APIs, personalized recommendations,
and analytics-driven progress insights.
"@
Draw-TextRect -G $g -Text $conclusion -Font $bodyFont -Brush $navy -X 160 -Y 1782 -W 1380 -H 190

# Footer
$g.DrawLine($linePen, 160, 2028, 1545, 2028)
Draw-TextRect -G $g -Text "Name - P Shashe Preetham" -Font $footerFont -Brush $navy -X 190 -Y 2060 -W 830 -H 60
Draw-TextRect -G $g -Text "Id - 2520030534" -Font $footerFont -Brush $navy -X 980 -Y 2060 -W 520 -H 60
Draw-TextRect -G $g -Text "Modern Web Technologies  |  Secure and Scalable" -Font $footerSub -Brush $muted -X 325 -Y 2142 -W 1050 -H 50

$out = Join-Path (Get-Location).Path "poster.png"
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)

$ringPen.Dispose()
$linePen.Dispose()
$archPen.Dispose()
$navy.Dispose()
$muted.Dispose()
$white.Dispose()
$red.Dispose()
$titleFont.Dispose()
$logoFont.Dispose()
$subLogoFont.Dispose()
$sectionFont.Dispose()
$cardHeaderFont.Dispose()
$bodyFont.Dispose()
$smallFont.Dispose()
$footerFont.Dispose()
$footerSub.Dispose()
$g.Dispose()
$bmp.Dispose()

Write-Output "Rendered: $out"
