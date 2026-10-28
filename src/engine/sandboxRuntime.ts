/**
 * Velo Sandbox Runtime & In-Browser Compiler
 * Converts any code (React JSX, TSX, HTML, Three.js, Vanilla JS)
 * into a fully executable, interactive, self-contained HTML5 application.
 */

export function transpileToRunnableHtml(code: string, title = 'Velo MI Live Project'): string {
  if (!code || typeof code !== 'string') {
    return createErrorHtml('لا يوجد كود للعرض', 'يرجى تقديم كود برمجي صالح للتشغيل.');
  }

  const trimmed = code.trim();

  // 1. If it's already a full HTML document, return as-is
  if (trimmed.includes('<!DOCTYPE html>') || (trimmed.includes('<html') && trimmed.includes('</html>'))) {
    return trimmed;
  }

  // 2. Check if the code is a React / JSX / TSX Component
  const hasReactImports = /import\s+.*(?:React|useState|useEffect).*from/i.test(trimmed);
  const hasJSX = /<[A-Za-z][A-Za-z0-9]*[\s\S]*>[\s\S]*<\/[A-Za-z][A-Za-z0-9]*>|<[A-Za-z][A-Za-z0-9]*[\s\S]*\/>/.test(trimmed);
  const hasComponentDecl = /(?:const|function)\s+([A-Z][a-zA-Z0-9_]*)\s*(?:=|\()/i.test(trimmed);
  const hasExportDefault = /export\s+default\s+([a-zA-Z0-9_]+)/i.test(trimmed);

  if (hasReactImports || (hasJSX && hasComponentDecl) || hasExportDefault) {
    return compileReactComponent(trimmed, title);
  }

  // 3. Check if it's pure HTML with Tailwind / JS
  if (trimmed.startsWith('<div') || trimmed.startsWith('<section') || trimmed.startsWith('<main') || trimmed.startsWith('<header')) {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Cairo', sans-serif; margin: 0; padding: 0; background: #07090e; color: #f8fafc; }
  </style>
</head>
<body class="min-h-screen">
  ${trimmed}
</body>
</html>`;
  }

  // 4. Fallback: Wrap in JavaScript execution environment
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</head>
<body class="bg-slate-950 text-white min-h-screen p-4">
  <div id="app"></div>
  <script>
    try {
      ${trimmed}
    } catch(err) {
      document.body.innerHTML = '<div style="color:#ef4444;padding:24px;font-family:sans-serif;"><h3>خطأ أثناء تشغيل الكود:</h3><pre>' + err.message + '</pre></div>';
    }
  </script>
</body>
</html>`;
}

function compileReactComponent(rawCode: string, title: string): string {
  // Extract Component Name
  let rootComponentName = 'App';
  const exportMatch = rawCode.match(/export\s+default\s+([a-zA-Z0-9_]+)/);
  if (exportMatch && exportMatch[1]) {
    rootComponentName = exportMatch[1];
  } else {
    const compMatch = rawCode.match(/(?:const|function)\s+([A-Z][a-zA-Z0-9_]*)/);
    if (compMatch && compMatch[1]) {
      rootComponentName = compMatch[1];
    }
  }

  // Clean code for Babel standalone:
  // Remove import statements (e.g. import React from 'react';)
  let cleanCode = rawCode
    .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '')
    .replace(/export\s+default\s+[a-zA-Z0-9_]+;?/g, '')
    .replace(/export\s+(?:const|function|class)/g, (match) => match.replace('export ', ''));

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- React 18 & ReactDOM -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <!-- Babel Standalone -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Cairo', 'Plus Jakarta Sans', sans-serif; background: #07090e; color: #f8fafc; margin: 0; padding: 0; }
  </style>
</head>
<body class="min-h-screen">
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect, useRef, useMemo, useCallback } = React;

    // Universal Icon Fallback Proxy
    const IconFallback = ({ name, size = 18, className = '', color = 'currentColor', ...rest }) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...rest}
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );

    // Common Lucide icon mocks
    const ChevronRight = (p) => <IconFallback {...p} />;
    const ChevronLeft = (p) => <IconFallback {...p} />;
    const ChevronDown = (p) => <IconFallback {...p} />;
    const ChevronUp = (p) => <IconFallback {...p} />;
    const Star = (p) => <IconFallback {...p} />;
    const Shield = (p) => <IconFallback {...p} />;
    const Check = (p) => <IconFallback {...p} />;
    const X = (p) => <IconFallback {...p} />;
    const Play = (p) => <IconFallback {...p} />;
    const Eye = (p) => <IconFallback {...p} />;
    const Car = (p) => <IconFallback {...p} />;
    const ShoppingBag = (p) => <IconFallback {...p} />;
    const ShoppingCart = (p) => <IconFallback {...p} />;
    const Menu = (p) => <IconFallback {...p} />;
    const Phone = (p) => <IconFallback {...p} />;
    const Mail = (p) => <IconFallback {...p} />;
    const MapPin = (p) => <IconFallback {...p} />;
    const ArrowRight = (p) => <IconFallback {...p} />;
    const ArrowLeft = (p) => <IconFallback {...p} />;
    const Sparkles = (p) => <IconFallback {...p} />;

    try {
      ${cleanCode}

      // Mount Root
      const RootTarget = typeof ${rootComponentName} !== 'undefined' ? ${rootComponentName} : () => (
        <div className="p-8 text-center text-slate-300">
          <h2 className="text-xl font-bold">تم تجهيز التطبيق بنجاح</h2>
        </div>
      );

      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(<RootTarget />);
    } catch (err) {
      console.error('Runtime error:', err);
      document.getElementById('root').innerHTML = \`
        <div style="background:#0f172a;color:#f8fafc;padding:32px;font-family:sans-serif;border-radius:16px;margin:24px;border:1px solid #ef4444;">
          <h2 style="color:#ef4444;font-size:18px;margin-bottom:8px;">⚠️ تنبيه بيئة التشغيل (Velo Sandbox):</h2>
          <p style="font-size:14px;color:#cbd5e1;">حدث خطأ في قراءة الكود: \${err.message}</p>
        </div>
      \`;
    }
  </script>
</body>
</html>`;
}

function createErrorHtml(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>Velo Runtime Error</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white p-8 font-sans flex items-center justify-center min-h-screen">
  <div class="max-w-md bg-slate-900 border border-red-500/40 p-6 rounded-2xl text-center">
    <div class="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4 font-bold text-xl">!</div>
    <h2 class="text-lg font-bold text-red-400">${title}</h2>
    <p class="text-xs text-slate-300 mt-2">${message}</p>
  </div>
</body>
</html>`;
}
