using AzureSignalRService;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Messenger API",
        Version = "v1"
    });
});

// Добавляем сервисы CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins("http://localhost:8100") // Разрешаем доступ из Ionic + Vue приложения
                                .AllowAnyHeader()
                                .AllowAnyMethod()
                                .AllowCredentials());
});

var app = builder.Build();

// Enable Swagger for all environments
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Messenger API V1");
    c.RoutePrefix = "swagger";
});

// Static files middleware should be before routing
app.UseDefaultFiles();
app.UseStaticFiles();

// Применяем политику CORS
app.UseCors("AllowSpecificOrigin");

app.UseRouting();

// Map controllers and endpoints
app.MapControllers();
app.MapHub<ChatHub>("/messenger/hub");
app.MapGet("/messenger", () => Results.Redirect("/messenger/index.html"));
app.MapGet("/", () => Results.Redirect("/messenger/index.html"));

app.Run();

