<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="author" content="Bagas Pardana Ilham" />
        
        <!-- Primary Meta Tags -->
        <meta name="title" content="{{ $metaTitle ?? 'Bagas Pardana Ilham — Personal Manifesto' }}">
        <meta name="description" content="{{ $metaDescription ?? 'The personal manifesto of Bagas Pardana Ilham—quiet IT projects, blog essays, and contemplative notes inspired by running in nature and piano sketches.' }}">
        <link rel="canonical" href="{{ $metaUrl ?? url()->current() }}">

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ $metaUrl ?? url()->current() }}">
        <meta property="og:title" content="{{ $metaTitle ?? 'Bagas Pardana Ilham — Personal Manifesto' }}">
        <meta property="og:description" content="{{ $metaDescription ?? 'The personal manifesto of Bagas Pardana Ilham—quiet IT projects, blog essays, and contemplative notes inspired by running in nature and piano sketches.' }}">
        <meta property="og:image" content="{{ $metaImage ?? asset('favicon.svg') }}">
        <meta property="og:site_name" content="Bagas Personal Manifesto">

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="{{ $metaUrl ?? url()->current() }}">
        <meta property="twitter:title" content="{{ $metaTitle ?? 'Bagas Pardana Ilham — Personal Manifesto' }}">
        <meta property="twitter:description" content="{{ $metaDescription ?? 'The personal manifesto of Bagas Pardana Ilham—quiet IT projects, blog essays, and contemplative notes inspired by running in nature and piano sketches.' }}">
        <meta property="twitter:image" content="{{ $metaImage ?? asset('favicon.svg') }}">

        @if(isset($metaJsonLd))
        <script type="application/ld+json">
            {!! json_encode($metaJsonLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}
        </script>
        @endif

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@400;500;600&family=Cormorant+Garamond:wght@400;500&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="bg-[#050505] text-mist font-body antialiased">
        @inertia
    </body>
</html>
