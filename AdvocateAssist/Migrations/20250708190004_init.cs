using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AdvocateAssist.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Clients",
                columns: table => new
                {
                    ClientId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClientFname = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ClientLname = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReferredBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Picture = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NidNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Division = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    District = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clients", x => x.ClientId);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    PaymentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PaymentHead = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.PaymentId);
                });

            migrationBuilder.CreateTable(
                name: "ClientPayments",
                columns: table => new
                {
                    ClientPaymentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClientId = table.Column<int>(type: "int", nullable: false),
                    PaymentId = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaymentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReceiptNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TransactionNo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Remarks = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientPayments", x => x.ClientPaymentId);
                    table.ForeignKey(
                        name: "FK_ClientPayments_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "ClientId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClientPayments_Payments_PaymentId",
                        column: x => x.PaymentId,
                        principalTable: "Payments",
                        principalColumn: "PaymentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Clients",
                columns: new[] { "ClientId", "City", "ClientFname", "ClientLname", "DateOfBirth", "District", "Division", "Email", "NidNumber", "PhoneNumber", "Picture", "ReferredBy" },
                values: new object[,]
                {
                    { 1, "Tongi", "Mithila", "Sultana", new DateTime(1992, 4, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Gazipur", "Dhaka", "mithila@example.com", "1122334455", "01811000001", "mithila.png", "Mr. Rahman" },
                    { 2, "Teknaf", "Abdullah", "Khan", new DateTime(1988, 9, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Cox's Bazar", "Chittagong", "abdullah.k@example.com", "556678899", "01811000002", "abdullah.jpg", "Self" }
                });

            migrationBuilder.InsertData(
                table: "Payments",
                columns: new[] { "PaymentId", "PaymentHead" },
                values: new object[,]
                {
                    { 1, "Consultation Fee" },
                    { 2, "Case Filing Fee" },
                    { 3, "Drafting Fee" },
                    { 4, "Incidental Cost " }
                });

            migrationBuilder.InsertData(
                table: "ClientPayments",
                columns: new[] { "ClientPaymentId", "Amount", "ClientId", "PaymentDate", "PaymentId", "ReceiptNumber", "Remarks", "TransactionNo" },
                values: new object[,]
                {
                    { 1, 1500.00m, 1, new DateTime(2025, 7, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, "RCPT-001", "Initial consultation", "TXN-001" },
                    { 2, 3000.00m, 2, new DateTime(2025, 7, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, "RCPT-002", "Filing fee for criminal case", "TXN-002" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClientPayments_ClientId",
                table: "ClientPayments",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_ClientPayments_PaymentId",
                table: "ClientPayments",
                column: "PaymentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClientPayments");

            migrationBuilder.DropTable(
                name: "Clients");

            migrationBuilder.DropTable(
                name: "Payments");
        }
    }
}
