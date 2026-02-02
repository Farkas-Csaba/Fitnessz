using System.Text;
using Fitnessz.Common.DataContext;
using Fitnessz.WebApi.Repositories;
using Fitnessz.WebApi.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace Fitnessz.WebApi;
using Microsoft.EntityFrameworkCore;
public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var connectionString = builder.Configuration.GetConnectionString("PostgresConnection") ?? throw new InvalidOperationException("connectionString postgresConnection not found");
        builder.Services.AddDbContext<ForumDbContext>(options => options.UseNpgsql(connectionString));

        var rsaKey = Keyhelper.GetPrivateKey(); // 1. Get the Key (In production, this would be the Public Key)

        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        Console.WriteLine("Auth failed: " + context.Exception.Message);
                        return Task.CompletedTask;
                    }
                };
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    //switched from symmetric to rsa key
                    IssuerSigningKey = rsaKey,
                    ValidateIssuer = false, //true in production!
                    ValidateAudience = false, //true in production
                    RequireExpirationTime = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });
        // 2. Give it to the Dependency Injection container 
        // so the Login Controller can "ask" for it.
        builder.Services.AddSingleton(rsaKey);
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAngular", policy =>
            {
                policy.WithOrigins("https;//localhost:4200")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });
        builder.Services.AddControllers();
        // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
        builder.Services.AddOpenApi();
        builder.Services.AddScoped<IThreadRepository, ForumThreadRepository>();
        builder.Services.AddScoped<IForumPostRepository, ForumPostRepository>();
        builder.Services.AddScoped<IForumUserRepository, ForumUserRepository>();
        builder.Services.AddScoped<IForumCategory, ForumCategoryRepository>(); //Added after creating the interface and repository
        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        app.UseHttpsRedirection();

        app.UseCors("AllowAngular"); //Is this the right place?
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }
}