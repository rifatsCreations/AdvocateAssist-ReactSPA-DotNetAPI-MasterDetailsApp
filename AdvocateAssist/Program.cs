using AdvocateAssist.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddNewtonsoftJson(options => {
        options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
    });
// DbContext
builder.Services.AddDbContext<AdvocateAssistContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("con") ?? throw new InvalidOperationException("Connection string is not found"));
});

builder.Services.AddCors(options => {
    options.AddPolicy(name: "AllowSpecificOrigin",
    policy => {
        policy.AllowAnyOrigin()
    .AllowAnyHeader().AllowAnyMethod();
    });
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("AllowSpecificOrigin");
app.UseAuthorization();

app.MapControllers();

app.Run();
