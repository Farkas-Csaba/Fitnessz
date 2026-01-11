using Fitnessz.Common.EntityModel;
using Thread = Fitnessz.Common.EntityModel.Thread;

namespace Fitnessz.Common.DataContext;
using Microsoft.EntityFrameworkCore;


public class ForumDbContext : DbContext
{
   public DbSet<Post>? Posts { get; set; }
   public DbSet<Thread>? Threads { get; set; }

   public ForumDbContext(DbContextOptions<ForumDbContext> options) : base(options)
   {
   }

   protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
   {
      
     
   }
}