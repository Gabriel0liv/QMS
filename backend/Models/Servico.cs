using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    // Representa a tabela "Servicos" na base de dados (Referente a serviços externos ou pintura)
    public class Servico
    {
        // Chave Primária (PK)
        [Key]
        public int Id { get; set; }

        // Custo associado a decapagem / limpeza
        [Required]
        public decimal CustoDecapar { get; set; } = 0;

        // Valor base do serviço
        [Required]
        public decimal Valor { get; set; } = 0;

        // Data em que este custo/serviço entrou em vigor
        [Required]
        public DateTime DataInicio { get; set; }

        // Data de fim da validade do serviço (nulo se for o atual)
        public DateTime? DataFim { get; set; }

        // Um serviço pode estar associado a muitos movimentos
        public ICollection<Movimento> Movimentos { get; set; } = new List<Movimento>();
    }
}
