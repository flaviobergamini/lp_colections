/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Em produção (Docker), o backend Python roda no mesmo container em 127.0.0.1:8000.
    // Em dev local, aponta para o uvicorn rodando na máquina do desenvolvedor.
    const pythonBackend = process.env.PYTHON_BACKEND_URL || "http://127.0.0.1:8000";
    return [
      {
        source: "/py/:path*",
        destination: `${pythonBackend}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
