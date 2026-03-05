### 1. Utilizador

- **`utilizador_codigo`**: `varchar(255)` | **PK** | **NOT NULL**
- **`nome`**: `varchar(255)` | **NOT NULL**
- **`email`**: `varchar(255)` | **NOT NULL** | **UNIQUE** _(Não podem existir 2 utilizadores com o mesmo email)_
- **`active`**: `bit` | **NOT NULL** _(Por defeito: 1/true)_
- **`cargo_id`**: `integer` | **NOT NULL** | **FK** -> **Relacionamento N:1** com `cargo` _(Muitos utilizadores para 1 cargo)_
- **`nivel_id`**: `integer` | **NOT NULL** | **FK** -> **Relacionamento N:1** com `Nivel`

### 2. cargo

- **`id`**: `integer` | **PK** | **NOT NULL**
- **`descricao`**: `varchar(255)` | **NOT NULL** | **UNIQUE** _(Ex: "Operador" não deve ser inserido duas vezes)_

### 3. Nivel

- **`id`**: `integer` | **PK** | **NOT NULL**
- **`descricao`**: `varchar(255)` | **NOT NULL** | **UNIQUE** _(Ex: "Admin", "Normal")_

### 4. Documento_tecnico

- **`id`**: `integer` | **PK** | **NOT NULL**
- **`artigo_codigo`**: `varchar(255)` | **NOT NULL** | **FK** -> **Relacionamento N:1** com `artigo` _(Um documento tem de pertencer a uma peça)_
- **`tipo_documento`**: `varchar(255)` | **NOT NULL**
- **`caminho_ficheiro`**: `varchar(255)` | **NOT NULL** | **UNIQUE** _(Para evitar ficheiros repetidos apontando para o mesmo sítio)_
- **`is_oficial`**: `bit` | **NOT NULL** _(Por defeito: 0/false)_

### 5. Assinatura_documento

- **`id`**: `integer` | **PK** | **NOT NULL**
- **`departamento_assinatura`**: `varchar(255)` | **NOT NULL**
- **`assinatura_hash`**: `varchar(255)` | **NOT NULL** | **UNIQUE** _(O carimbo digital é único)_
- **`data_assinatura`**: `date` | **NOT NULL**
- **`documento_id`**: `integer` | **NOT NULL** | **FK** -> **Relacionamento N:1** com `Documento_tecnico`
- **`Utilizadorutilizador_codigo`**: `varchar(255)` | **NOT NULL** | **FK** -> **Relacionamento N:1** com `Utilizador`

### 6. fornecedor

- **`fornecedor_codigo`**: `varchar(255)` | **PK** | **NOT NULL**
- **`nome`**: `varchar(255)` | **NOT NULL**
- **`morada`**: `varchar(255)` | _Nullable_ _(Pode ser opcional)_

### 7. Fornecedor_classificacao

- **`id`**: `integer` | **PK** | **NOT NULL**
- **`ano_fiscal`**: `integer` | **NOT NULL**
- **`classificacao`**: `varchar(255)` | **NOT NULL**
- **`fornecedor_codigo`**: `varchar(255)` | **NOT NULL** | **FK** -> **Relacionamento N:1** com `fornecedor`
  _(**Nota Extra:** Deve existir um índice UNIQUE composto por `[fornecedor_codigo + ano_fiscal]` para garantir que um fornecedor só tem uma classificação por ano)._

### 8. familia

- **`id`**: `integer` | **PK** | **NOT NULL**
- **`codigo`**: `varchar(255)` | **NOT NULL** | **UNIQUE**
- **`descricao`**: `varchar(255)` | **NOT NULL**
- **`parametros_inspecao`**: `varchar(255)` | _Nullable_

### 9. diversos

- **`id`**: `integer` | **PK** | **NOT NULL**
- **`descricao`**: `varchar(255)` | **NOT NULL**

### 10. Maquinas

- **`maquina_codigo`**: `varchar(255)` | **PK** | **NOT NULL**
- **`descricao`**: `varchar(255)` | **NOT NULL**
- **`estado`**: `bit` | **NOT NULL**
- **`preco_usinagem`**: `decimal(19)` | **NOT NULL** _(Se não houver, deve ser 0)_
- **`preco_mao_obra`**: `decimal(19)` | **NOT NULL** _(Se não houver, deve ser 0)_
- **`preco_energia`**: `decimal(19)` | **NOT NULL** _(Se não houver, deve ser 0)_
- **`setor`**: `integer` | _Nullable_

### 11. artigo

- **`artigo_codigo`**: `varchar(255)` | **PK** | **NOT NULL**
- **`descricao`**: `varchar(255)` | **NOT NULL**
- **`unidade`**: `integer` | **NOT NULL**
- **`peso`**: `decimal(19)` | **NOT NULL**
- **`familia_id`**: `integer` | **FK** references `familia(id)` | **NOT NULL**
- **`diversos_id`**: `integer` | **FK** references `diversos(id)` | **NOT NULL**
- **`maquina_codigo`**: `varchar(255)` | **FK** references `maquinas(maquina_codigo)` | **NOT NULL**

### 12. artigo_Custo

- **`id`**: `integer` | **PK** | **NOT NULL**
- **`data_inicio`**: `date` | **NOT NULL**
- **`data_fim`**: `date` | _Nullable_ _(Se for Null, significa que é o custo atual)_
- **`pri_total`**: `decimal(19)` | **NOT NULL**
- **`pra_matprim`**: `decimal(19)` | **NOT NULL**
- **`preco_energia`**: `decimal(19)` | **NOT NULL**
- **`prwi_maoobra`**: `decimal(19)` | **NOT NULL**
- **`pru_maquina`**: `decimal(19)` | **NOT NULL**
- **`custo_pintura`**: `decimal(19)` | **NOT NULL**
- **`artigo_codigo`**: `varchar(255)` | **NOT NULL** | **FK** -> **Relacionamento N:1** com `artigo`

### 13. Catalogo_Defeito

- **`id`**: `integer` | **PK** | **NOT NULL**
- **`codigo`**: `varchar(255)` | **NOT NULL** | **UNIQUE**
- **`descricao`**: `varchar(255)` | **NOT NULL**

### 14. Servicos

- **`id`**: `integer` | **PK** | **NOT NULL**
- **`custo_decapar`**: `decimal(19)` | **NOT NULL**
- **`valor`**: `decimal(19)` | **NOT NULL**
- **`data_inicio`**: `date` | **NOT NULL**
- **`data_fim`**: `date` | _Nullable_

### 15. tipo_movimento

- **`id`**: `integer` | **PK** | **NOT NULL**
- **`descricao`**: `varchar(255)` | **NOT NULL** | **UNIQUE** _(Ex: "Entrada", "Saída", "Sucata")_

### 16. Movimentos

- **`id`**: `integer` | **PK** | **NOT NULL**
- **`estado`**: `varchar(255)` | **NOT NULL**
- **`localizacao`**: `varchar(255)` | **NOT NULL**
- **`data_movimento`**: `date` | **NOT NULL**
- **`quantidade`**: `decimal(19)` | **NOT NULL**
- **`descontar`**: `bit` | **NOT NULL**
- **`observacoes`**: `varchar(255)` | _Nullable_
- **`utilizador_codigo`**: `varchar(255)` | **NOT NULL** | **FK** -> **Relacionamento N:1** com `Utilizador`
- **`artigo_codigo`**: `varchar(255)` | **NOT NULL** | **FK** -> **Relacionamento N:1** com `artigo`
- **`maquina_codigo`**: `varchar(255)` | **NOT NULL** | **FK** -> **Relacionamento N:1** com `Maquinas`
- **`tipo`**: `integer` | **NOT NULL** | **FK** -> **Relacionamento N:1** com `tipo_movimento`
- **`servico_id`**: `integer` | _Nullable_ | **FK** -> **Relacionamento N:1** com `Servicos`
- **`defeito_id`**: `integer` | _Nullable_ | **FK** -> **Relacionamento N:1** com `Catalogo_Defeito`

### 17. Retrabalho

- **`id`**: `integer` | **PK** | **NOT NULL**
- **`setor_identificado`**: `varchar(255)` | **NOT NULL**
- **`acao_executar`**: `varchar(255)` | **NOT NULL**
- **`data_retrabalho`**: `date` | **NOT NULL**
- **`tempo_minutos`**: `decimal(19)` | **NOT NULL**
- **`custo_retrabalho`**: `decimal(19)` | _Nullable_ _(Calculado à posteriori)_
- **`custo_rejeicao`**: `decimal(19)` | _Nullable_ _(Calculado à posteriori)_
- **`custo_nc`**: `decimal(19)` | _Nullable_ _(Calculado à posteriori)_
- **`maquina_rejeicao`**: `varchar(255)` | **NOT NULL** | **FK** -> **Relacionamento N:1** com `Maquinas`
- **`id_movimento`**: `integer` | **NOT NULL** | **UNIQUE** | **FK** -> **Relacionamento 1:1** com `Movimentos` _(Um Retrabalho pertence a 1 e apenas 1 Movimento específico)_

### 18. Nao_conforme

- **`id`**: `integer` | **PK** | **NOT NULL**
- **`data_registo`**: `date` | **NOT NULL**
- **`qtd_sage`**: `decimal(19)` | **NOT NULL** _(Se não houver no SAGE, deve assumir 0)_
- **`id_movimento`**: `integer` | **NOT NULL** | **UNIQUE** | **FK** -> **Relacionamento 1:1** com `Movimentos` _(Uma NC pertence a 1 e apenas 1 Movimento)_

### 19. Rececao_inspecao

- **`id`**: `integer` | **PK** | **NOT NULL**
- **`sage_pedido_id`**: `varchar(255)` | **NOT NULL**
- **`linha`**: `integer` | **NOT NULL** _(O SAGE Pedido + Linha não se devem repetir)_
- **`data_rececao`**: `date` | **NOT NULL**
- **`qtd_total_recebida`**: `decimal(19)` | **NOT NULL**
- **`decisao_final`**: `varchar(255)` | **NOT NULL**
- **`custo_unitario_momento`**: `decimal(19)` | **NOT NULL**
- **`fatura`**: `varchar(255)` | _Nullable_
- **`unidade`**: `varchar(255)` | **NOT NULL**
- **`quantidade`**: `decimal(19)` | **NOT NULL**
- **`fornecedor_codigo`**: `varchar(255)` | **NOT NULL** | **FK** -> **Relacionamento N:1** com `fornecedor`
- **`artigo_codigo`**: `varchar(255)` | **NOT NULL** | **FK** -> **Relacionamento N:1** com `artigo`
- **`utilizador_codigo`**: `varchar(255)` | **NOT NULL** | **FK** -> **Relacionamento N:1** com `Utilizador`

### 20. Justificacao_NOK

- **`id`**: `integer` | **PK** | **NOT NULL**
- **`qtd_afetada`**: `decimal(19)` | **NOT NULL**
- **`observacoes`**: `varchar(255)` | _Nullable_
- **`rececao_id`**: `integer` | **NOT NULL** | **FK** -> **Relacionamento N:1** com `Rececao_inspecao`
- **`defeito_id`**: `integer` | **NOT NULL** | **FK** -> **Relacionamento N:1** com `Catalogo_Defeito`
