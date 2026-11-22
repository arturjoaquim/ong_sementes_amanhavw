# Security Advisory: SEC-ADV-003

## Identificação
- **ID**: SEC-ADV-003
- **Título**: Vulnerabilidades Conhecidas em Dependências do Ecossistema Angular 20.3.0
- **Severidade**: Low (CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:N/A:L - Base Score: 4.8)
- **CWE**: 
  - CWE-400: Uncontrolled Resource Consumption
  - CWE-201: Insertion of Sensitive Information Into Sent Data
  - CWE-79: Improper Neutralization of Input During Web Page Generation ('Cross-site Scripting')
- **Componentes Afetados**:
  - `package.json` (dependências `@angular/animations`, `@angular/common`, `@angular/core`, `@angular/forms`, `@angular/router`, etc.)
  - `package-lock.json`

---

## Descrição do Problema
O projeto utiliza a release inicial do Angular 20 (`20.3.0` / `20.3.10`). A análise de segurança via `npm audit` revelou 7 alertas de severidade alta em tempo de execução/produção para essas versões:
- **GHSA-58c5-g7wp-6w37**: Vazamento de token XSRF através de URLs protocol-relative no HttpClient (corrigido em `20.3.14`).
- **GHSA-48r7-hpm6-gfxm** & **GHSA-p3vc-36g9-x9gr**: Denial of Service (DoS) por esgotamento de memória no formatador de datas e números (`formatDate` / `digitsInfo`).
- **GHSA-hh8m-fm6v-7cvg**: Bypass de sanitização em host bindings de diretivas no `@angular/core`.

## Impacto
Defesa em profundidade comprometida. Atacantes com capacidade de fornecer dados malformados para pipes de formatação ou endpoints HTTP podem explorar consumo descontrolado de recursos ou fuga de token CSRF.

## Remediação Recomendada
Atualizar as dependências do Angular para as versões que contêm os patches de segurança aplicados:
```bash
npm install @angular/animations@^20.3.35 @angular/common@^20.3.35 @angular/compiler@^20.3.35 @angular/core@^20.3.35 @angular/forms@^20.3.35 @angular/platform-browser@^20.3.35 @angular/router@^20.3.35
npm audit fix
```
Executar suite de testes e build de produção para assegurar inexistência de regressões:
```bash
npm test -- --watch=false
npm run build -- --configuration production
```
