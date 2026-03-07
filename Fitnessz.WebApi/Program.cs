using System.Text;
using Azure.Identity;
using Fitnessz.Common.DataContext;
using Fitnessz.Common.EntityModel;
using Fitnessz.WebApi.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using Azure.Extensions.AspNetCore.Configuration.Secrets;
namespace Fitnessz.WebApi;
using Microsoft.EntityFrameworkCore;
public class Program
{
    public static void Main(string[] args)
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        var builder = WebApplication.CreateBuilder(args);
        
        if (builder.Environment.IsProduction())
        {
            // Make sure "KeyVaultName" matches exactly what you put in App Service Env Variables
            var vaultName = builder.Configuration["KeyVaultName"];
            var vaultUri = new Uri($"https://{vaultName}.vault.azure.net/");
    
            builder.Configuration.AddAzureKeyVault(vaultUri, new DefaultAzureCredential());
            
        }
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("connectionString postgresConnection not found");
        builder.Services.AddDbContext<ForumDbContext>(options => options.UseNpgsql(connectionString));

        builder.Services.AddIdentity<User, IdentityRole<int>>(options => {
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = false;
            })
            .AddEntityFrameworkStores<ForumDbContext>();

        
        builder.Services.AddAuthentication(options => {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options => {
                options.TokenValidationParameters = new TokenValidationParameters {
                    ValidateIssuer = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
                };
            });
        
    
       
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowVercel", policy =>
            {
                policy.SetIsOriginAllowed(origin => origin.Contains("vercel.app"))
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });
        builder.Services.AddControllers();
        // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
        builder.Services.AddOpenApi();
        builder.Services.AddScoped<IThreadRepository, ForumThreadRepository>();
        builder.Services.AddScoped<IForumPostRepository, ForumPostRepository>();
        builder.Services.AddScoped<IForumCategory, ForumCategoryRepository>(); //Added after creating the interface and repository
        var app = builder.Build();
        
        app.MapOpenApi();
        app.MapScalarApiReference();
        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            
        }

        app.UseHttpsRedirection();

        app.UseCors("AllowVercel"); 
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }
}