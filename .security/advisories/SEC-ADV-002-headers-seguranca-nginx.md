# Security Advisory: SEC-ADV-002

## Identificação
- **ID**: SEC-ADV-002
- **Título**: Ausência de Headers de Hardening e HSTS no Proxy Reverso NGINX
- **Severidade**: Medium (CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N - Base Score: 5.4)
- **CWE**: 
  - CWE-1021: Improper Restriction of Rendered UI Layers or Frames (Clickjacking)
  - CWE-693: Protection Mechanism Failure
- **Componentes Afetados**:
  - `nginx.conf`
  - `Dockerfile`

---

## Descrição do Problema
O arquivo de configuração do NGINX (`nginx.conf`) que atua como servidor web estático do frontend e proxy reverso para o backend em `/api/` não declara cabeçalhos HTTP defensivos para o navegador do cliente.

Configuração atual:
```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Impacto
- **Clickjacking**: Sem `X-Frame-Options` ou `Content-Security-Policy: frame-ancestors`, qualquer site terceiro pode embutir o painel administrativo da ONG em um iframe malicioso e capturar cliques/ações dos operadores autenticados.
- **MIME Sniffing**: A ausência de `X-Content-Type-Options: nosniff` permite que browsers interpretem arquivos com tipos MIME inconsistentes de forma insegura.
- **Vazamento de Referrer**: Sem política de `Referrer-Policy`, URLs e parâmetros podem vazar em requisições a links externos.

## Remediação Recomendada
Adicionar as seguintes diretivas no bloco `server` do `nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' http://localhost:8080;" always;

    root /usr/share/nginx/html;
    index index.html;
    ...
}
```
