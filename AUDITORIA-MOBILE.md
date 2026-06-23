# Auditoria mobile da landing page Crivo

Data: 20/06/2026

## Escopo

Auditoria baseada no relatório `message (1).txt`, cobrindo estabilidade de viewport,
desempenho, ergonomia tátil, mídia, animações e acessibilidade.

## Conformidades que já existiam

- Seções principais utilizam `svh`, evitando cortes causados pelas barras móveis.
- Tipografia e dimensões usam `clamp()` e unidades relativas.
- Navbar móvel fica na zona inferior e respeita `safe-area-inset-bottom`.
- Scroll listeners principais são passivos.
- Animações de movimento priorizam `transform` e `opacity`.
- Existe suporte a `prefers-reduced-motion`.
- O zoom do navegador não está desativado.
- A timeline e o carrossel usam gestos nativos e Pointer Events.

## Melhorias implementadas

### Imagens

- Backgrounds da Hero migrados para `next/image`.
- O navegador recebe imagens responsivas conforme viewport e densidade de pixels.
- Apenas o primeiro background possui carregamento prioritário.
- Qualidade limitada a 82 para equilibrar nitidez e transferência.

### Vídeos

- Vídeos do Método passaram de `preload="auto"` para `preload="metadata"`.
- Somente o vídeo do card ativo de Soluções pode tocar.
- Todos os vídeos de Soluções são pausados quando a seção deixa de ser ativa.
- Vídeos decorativos foram removidos da árvore de acessibilidade.

### Scroll e animação

- Atualização da navbar limitada a uma execução por frame com `requestAnimationFrame`.
- Cálculos da timeline já estavam agrupados em `requestAnimationFrame` e foram mantidos.
- Filtros animados foram removidos dos elementos principais no mobile.
- Blur e saturação do liquid glass foram reduzidos em telas pequenas.
- A transição Método/Soluções continua controlada por transformações e opacidade.

### Toque e teclado

- Removido o destaque cinza padrão de toque sem desativar feedback customizado.
- Links e botões usam `touch-action: manipulation`.
- Dots do carrossel agora são botões de 44 px, navegáveis por teclado.
- Adicionados foco visível, estado pressionado e nomes acessíveis.
- Liberação de Pointer Capture agora é protegida contra gestos incompletos.

### Fontes e desenvolvimento

- Montserrat migrou do `@import` bloqueante para `next/font` com self-hosting.
- O código que ocultava o portal de erros do Next.js foi removido.

## Recomendações não aplicadas

- **Grade fixa de 12 colunas:** desnecessária para a composição atual; CSS Grid e Flex
  responsivos já resolvem o layout com menos complexidade.
- **`ontouchstart` global:** não aplicado por introduzir comportamento artificial e
  listeners desnecessários. Pointer Events já oferecem controle adequado.
- **Haptics e vibração:** não há ação de conversão que justifique vibração. Safari/iOS
  também não oferece uma API web confiável para esse uso.
- **Passkeys:** não existe autenticação nesta landing page.
- **Desativar o vídeo do cubo no mobile:** preservado por ser parte central da narrativa.
  A mitigação adotada foi carregamento de metadados e redução dos filtros.
- **`dvh`:** evitado nas seções principais para não recalcular layout durante o scroll.

## Pendências recomendadas

### Alta prioridade

- Recompactar os MP4 para WebM/MP4 modernos. Os vídeos atuais somam mais de 95 MB.
- Criar posters responsivos para os vídeos antes do primeiro frame.
- Implementar as seções `Essência` e `Projetos`, pois já existem links para elas.

### Antes da publicação

- Executar Lighthouse em modo mobile e registrar LCP, CLS, INP e peso transferido.
- Testar em um iPhone Safari real e em um Android intermediário.
- Verificar contraste WCAG após a definição final dos backgrounds.
- Adicionar política de privacidade antes de qualquer formulário de contato.

## Ferramenta externa opcional

Para reduzir os vídeos sem perda visual perceptível, recomenda-se instalar FFmpeg. Ele
não foi instalado automaticamente porque a escolha de codec e qualidade deve ser
comparada visualmente com os arquivos originais.
