using System;
using System.Collections.Generic;
using AdvocateAssist.Entities;
using Microsoft.EntityFrameworkCore;

namespace AdvocateAssist.Data;

public partial class AdvocateAssistContext : DbContext
{
    public AdvocateAssistContext()
    {
    }

    public AdvocateAssistContext(DbContextOptions<AdvocateAssistContext> options)
        : base(options)
    {
    }  
    public virtual DbSet<Client> Clients { get; set; }
    public virtual DbSet<ClientPayment> ClientPayments { get; set; }
    public virtual DbSet<Payment> Payments { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {


        modelBuilder.Entity<Client>().HasData(
            new Client
            {
                ClientId = 1,
                ClientFname = "Mithila",
                ClientLname = "Sultana",
                DateOfBirth = new DateTime(1992, 4, 10),
                Email = "mithila@example.com",
                PhoneNumber = "01811000001",
                ReferredBy = "Mr. Rahman",
                Picture = "mithila.png",
                NidNumber = "1122334455",
                Division = "Dhaka",
                District = "Gazipur",
                City = "Tongi"
            },
            new Client
            {
                ClientId = 2,
                ClientFname = "Abdullah",
                ClientLname = "Khan",
                DateOfBirth = new DateTime(1988, 9, 25),
                Email = "abdullah.k@example.com",
                PhoneNumber = "01811000002",
                ReferredBy = "Self",
                Picture = "abdullah.jpg",
                NidNumber = "556678899",
                Division = "Chittagong",
                District = "Cox's Bazar",
                City = "Teknaf"
            }
        );

        modelBuilder.Entity<Payment>().HasData(
            new Payment
            {
                PaymentId = 1,
                PaymentHead = "Consultation Fee"
            },
            new Payment
            {
                PaymentId = 2,
                PaymentHead = "Case Filing Fee"
            },
            new Payment 
            {
                PaymentId=3,
                PaymentHead= "Drafting Fee"
            },
            new Payment 
            {
                PaymentId=4,
                PaymentHead= "Incidental Cost "
            }
        );

        modelBuilder.Entity<ClientPayment>().HasData(
            new ClientPayment
            {
                ClientPaymentId = 1,
                ClientId = 1,
                PaymentId = 1,
                Amount = 1500.00m,
                PaymentDate = new DateTime(2025, 7, 1),
                ReceiptNumber = "RCPT-001",
                TransactionNo = "TXN-001",
                Remarks = "Initial consultation"
            },
            new ClientPayment
            {
                ClientPaymentId = 2,
                ClientId = 2,
                PaymentId = 2,
                Amount = 3000.00m,
                PaymentDate = new DateTime(2025, 7, 2),
                ReceiptNumber = "RCPT-002",
                TransactionNo = "TXN-002",
                Remarks = "Filing fee for criminal case"
            }
        );

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
