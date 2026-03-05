

### 1. Artigos (`artigos_QMS_20260304.csv`)

Esta consulta traz os dados mestres das peças, incluindo a família e a máquina associada.
**Linha de cabeçalho para colares no topo do CSV:**

```csv
cod;descriccao;categoria;Familia_cod;maq;Familia_desc;peso;estado;Unidade

```

**O que significa cada coluna:**

1. **`cod`**: Código do artigo (Ex: *08-301-002-104*) -> *Vai para `artigo.artigo_codigo*`
2. **`descriccao`**: Nome do artigo (Ex: *FECHO 3010...*) -> *Vai para `artigo.descricao*`
3. **`categoria`**: Categoria técnica (Ex: *SACA*) -> *Vai para `artigo.categoria*`
4. **`Familia_cod`**: Código da Família/Diversos (Ex: *ACE*) -> *Vai para `diversos*`
5. **`maq`**: Máquina Default (Ex: *SC01*) -> *Vai para `artigo.maquina_codigo*`
6. **`Familia_desc`**: Descrição da família (Ex: *03-Acessórios*) -> *Vai para `familia.descricao*`
7. **`peso`**: Peso calculado em Kg (Ex: *0.052315000*) -> *Vai para `artigo.peso*`
8. **`estado`**: ativo / desativo
9. **`Unidade`**: Unidade de medida (Ex: *UN*) -> *Vai para `artigo.unidade*`

---

### 2. Custos dos Artigos (`ARTIGOS_CUSTO_QMS_20260304.csv`)

Aqui tens o histórico financeiro (Padrão de Snapshot que falámos antes!).
**Linha de cabeçalho para colares no topo do CSV:**

```csv
cod;DATAINICIO_0;DATAFIM_0;matprima;maquina;mobra;subcontratacao;energia;precototal;OPERACAO

```

**O que significa cada coluna:**

1. **`cod`**: Código do Artigo (Ex: *0083-GNS*)
2. **`DATAINICIO_0`**: Início de validade do preço (Ex: *2025-12-01 00:00:00.000*)
3. **`DATAFIM_0`**: Fim de validade do preço
4. **`matprima`**: Custo da Matéria Prima -> *Vai para `artigo_Custo.pra_matprim*`
5. **`maquina`**: Custo de Máquina -> *Vai para `artigo_Custo.pru_maquina*`
6. **`mobra`**: Custo de Mão de Obra -> *Vai para `artigo_Custo.prwi_maoobra*`
7. **`subcontratacao`**: Custos externos
8. **`energia`**: Custo de Energia -> *Vai para `artigo_Custo.preco_energia*`
9. **`precototal`**: Preço Total (Soma base) -> *Vai para `artigo_Custo.pri_total*`
10. **`OPERACAO`**: Custo calculado da operação total

---

### 3. Máquinas (`MAQUINAS_qms_20260304.csv`)

Tabela dos centros de trabalho / equipamentos da fábrica.
**Linha de cabeçalho para colares no topo do CSV:**

```csv
MAQ;DESCRICAMAQ;ESTADO;SETOR

```

**O que significa cada coluna:**

1. **`MAQ`**: Código da Máquina (Ex: *AE01*) -> *Vai para `Maquinas.maquina_codigo*`
2. **`DESCRICAMAQ`**: Nome (Ex: *Máquina de Embalar 1*) -> *Vai para `Maquinas.descricao*`
3. **`ESTADO`**: Na exportação veio "ina" (inativo) ou espaços em branco " " (possivelmente ativo). *Terás de tratar isto no backend para converter para `bit` (True/False).*
4. **`SETOR`**: Código do Setor (Ex: *15APA*) -> *Vai para `Maquinas.setor*`

---

### 4. Fornecedores (`FORNECEDORES_qms_20260304.csv`)

Tabela simples para associar às Receções.
**Linha de cabeçalho para colares no topo do CSV:**

```csv
BPSNUM_0;BPSNAM_0;TIPO_0

```

**O que significa cada coluna:**

1. **`BPSNUM_0`**: Código (Ex: *0000*) -> *Vai para `fornecedor.fornecedor_codigo*`
2. **`BPSNAM_0`**: Nome (Ex: *WIDEPARTNER 2 PORTUGAL, LDA*) -> *Vai para `fornecedor.nome*`
3. **`TIPO_0`**: A classificação deles (Ex: *NormalNormal*, *ReduzidoReduzido*). *Nota: Parecem ter strings duplicadas na BD do SAGE, talvez possas limpar isso com um `.Replace("NormalNormal", "Normal")` no C#.*

---

### 5. Receções Pendentes (`RECEPCOES_qms_20260304.csv`)

As guias que dão entrada no armazém e que o departamento de Qualidade vai ter de inspecionar.
**Linha de cabeçalho para colares no topo do CSV:**

```csv
RECEPRION;ORDER;TERCEIRO;COD;PRECO;QT;QTINV;CUSTOCOMPRA;DATAMOV;LINHA

```

**O que significa cada coluna:**

1. **`RECEPRION`**: Guia/Receção (Ex: *PTH-G01-25/02605*) -> *Vai para `Rececao_inspecao.sage_pedido_id*`
2. **`ORDER`**: Ordem de Compra
3. **`TERCEIRO`**: Cód. do Fornecedor (Ex: *6080*) -> *Vai para `Rececao_inspecao.fornecedor_codigo*`
4. **`COD`**: Cód. do Artigo -> *Vai para `Rececao_inspecao.artigo_codigo*`
5. **`PRECO`**: Preço Unitário -> *Vai para `Rececao_inspecao.custo_unitario_momento*`
6. **`QT`**: Quantidade recebida -> *Vai para `Rececao_inspecao.qtd_total_recebida*`
7. **`QTINV`**: Quantidade faturada/inventariada
8. **`CUSTOCOMPRA`**: Custo total da linha
9. **`DATAMOV`**: Data de Receção -> *Vai para `Rececao_inspecao.data_rececao*`
10. **`LINHA`**: Número da linha no SAGE
