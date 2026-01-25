using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fitnessz.Common.DataContext.Migrations
{
    /// <inheritdoc />
    public partial class ContentAddedToThreadEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Content",
                table: "ForumThreads",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Content",
                table: "ForumThreads");
        }
    }
}
