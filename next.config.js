const nextConfig = {
    experimental: {
        appDir: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        domains: ["localhost", "ulsantour.vercel.app"],
        unoptimized: true,
    },
}

export default nextConfig
