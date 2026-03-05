using backend.Data;
using Microsoft.EntityFrameworkCore;


// builder 
// Adiciona suporte para Controllers (o que permite usar @RestController)
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Ativa as ferramentas de documentação (Swagger)
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CONFIGURAÇÃO DA BASE DE DADOS (EF Core)
// Equivalente a configurar o DataSource no Spring.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString)
           .UseLowerCaseNamingConvention());

// CONFIGURAÇÃO DE CORS
// Permite que o seu React (porta 5173) chame esta API.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});



var app = builder.Build();

// Inicialização e Seeding de Dados Automático (Executado no arranque se a BD estiver vazia)
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // A pasta /app/dados reflete os mapeamentos configurados no docker-compose.yml 
    // Em caso de corrrer sem docker, pode colocar um caminho local (ex: ./dados)
    var dataFolder = Environment.GetEnvironmentVariable("DATA_FOLDER") ?? "/app/dados"; 
    await DataSeeder.SeedDataAsync(context, dataFolder);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
