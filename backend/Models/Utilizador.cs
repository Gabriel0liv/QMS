using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    // Representa a tabela "Utilizador" na base de dados
    public class Utilizador
    {
        // Chave Primária (PK) - O código do utilizador (ex: ID de funcionário)
        [Key]
        [MaxLength(255)]
        public string UtilizadorCodigo { get; set; } = string.Empty;

        // Nome completo do utilizador
        [Required]
        [MaxLength(255)]
        public string Nome { get; set; } = string.Empty;

        // Email do utilizador (Deve ser único na base de dados)
        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        // Estado do utilizador (true = ativo, false = inativo)
        // Por defeito, um novo utilizador está ativo (1)
        [Required]
        public bool Active { get; set; } = true;

        // Chave Estrangeira (FK) para a tabela Cargo
        [Required]
        public int CargoId { get; set; }
        
        // Propriedade de Navegação: Diz ao Entity Framework para carregar os dados do Cargo
        [ForeignKey("CargoId")]
        public Cargo? Cargo { get; set; }

        // Chave Estrangeira (FK) para a tabela Nivel
        [Required]
        public int NivelId { get; set; }

        // Propriedade de Navegação para Nivel
        [ForeignKey("NivelId")]
        public Nivel? Nivel { get; set; }

        // Um utilizador pode ter várias assinaturas de documentos
        public ICollection<AssinaturaDocumento> Assinaturas { get; set; } = new List<AssinaturaDocumento>();
    
        // password encriptada
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
    }
}
