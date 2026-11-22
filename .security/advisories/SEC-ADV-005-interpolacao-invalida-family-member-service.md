# Security Advisory: SEC-ADV-005

## Identificação
- **ID**: SEC-ADV-005
- **Título**: Falha de Interpolação de URL no Serviço FamilyMemberService
- **Severidade**: Informational (CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:N/A:N - Base Score: 0.0)
- **CWE**: 
  - CWE-628: Function Call with Incorrect Order or Number of Arguments
- **Componentes Afetados**:
  - `src/app/modules/education/services/family-member.service.ts` (linha 11)

---

## Descrição do Problema
No serviço `FamilyMemberService`, a variável `apiUrl` interpola diretamente a referência ao objeto de módulo `environment` em vez da propriedade `environment.apiUrl`:
```typescript
import { environment } from '../../../../environments/environment';

export class FamilyMemberService {
  private http = inject(HttpClient);
  private apiUrl = `${environment}/families`; // <-- Erro de interpolação
```

## Impacto
Qualquer chamada para as operações de membros familiares resulta em requisições para URLs do tipo `http://<host>/[object%20Object]/families/...`, falhando imediatamente com erro HTTP 404 antes de alcançar a API de destino. Embora não seja uma vulnerabilidade de segurança explorável por atacantes, é um defeito de integridade e disponibilidade da funcionalidade.

## Remediação Recomendada
Corrigir a definição de `apiUrl` em `src/app/modules/education/services/family-member.service.ts`:
```typescript
- private apiUrl = `${environment}/families`;
+ private apiUrl = `${environment.apiUrl}/families`;
```
