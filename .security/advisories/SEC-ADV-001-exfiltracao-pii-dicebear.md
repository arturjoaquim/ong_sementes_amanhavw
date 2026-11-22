# Security Advisory: SEC-ADV-001

## Identificação
- **ID**: SEC-ADV-001
- **Título**: Exfiltração de PII de Crianças/Estudantes para API Pública de Terceiros (Dicebear)
- **Severidade**: Medium (CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:U/C:L/I:N/A:N - Base Score: 3.5)
- **CWE**: 
  - CWE-200: Exposure of Sensitive Information to an Unauthorized Actor
  - CWE-359: Exposure of Private Personal Information (PII)
- **Componentes Afetados**:
  - `src/app/modules/education/utils/student-preview.converter.ts` (linha 9)
  - `src/app/modules/education/utils/student.converter.ts` (linha 16)
  - `src/app/modules/education/components/student-list/student-list.component.html` (linha 30-34)

---

## Descrição do Problema
O frontend da ONG gera URLs de avatar dinâmicos utilizando a API externa pública `api.dicebear.com`. Ao montar a URL do avatar, o código interpola diretamente o nome completo da criança atendida como parâmetro de seed:
```typescript
avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${dto.studentName}`,
```
Quando o usuário administrativo navega pela lista de estudantes ou abre a tela de detalhes de um estudante, o navegador dispara requisições HTTP GET automáticas para os servidores da Dicebear.

## Impacto
- **Privacidade e LGPD**: O nome completo de crianças e adolescentes atendidos pela ONG, associado aos horários e endereços IP da instituição, é transmitido para servidores de terceiros sem base legal, consentimento expresso dos responsáveis ou necessidade técnica.
- **Risco de Correlação**: Potencial vazamento de dados de menores em conformidade com o Artigo 14 da Lei Geral de Proteção de Dados (LGPD).

## Caminho de Exploração / Reprodução
1. Fazer login no sistema e acessar a rota `/students`.
2. Abrir a aba *Network* das Ferramentas de Desenvolvedor do navegador.
3. Observar as requisições disparadas para `https://api.dicebear.com/7.x/avataaars/svg?seed=<Nome_Da_Crianca>`.

## Remediação Recomendada
1. **Descontinuar o consumo da API externa para avatares com PII**:
   - Renderizar iniciais do nome do aluno localmente no componente `<app-avatar-fallback>` (já implementado no projeto via Tailwind).
   - Caso um avatar gráfico seja necessário, pré-computar um hash anônimo (ex: SHA-256 do ID interno) ou servir ícones/vetores estáticos locais empacotados na aplicação.
2. Atualizar os conversores `student.converter.ts` e `student-preview.converter.ts` para não apontarem mais para `api.dicebear.com`.
