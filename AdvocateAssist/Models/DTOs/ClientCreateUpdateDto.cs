using AdvocateAssist.Entities;

namespace AdvocateAssist.Models.DTOs
{
    public class ClientCreateUpdateDto
    {
        public int ClientId { get; set; }

        public string ClientFname { get; set; } = null!;

        public string ClientLname { get; set; } = null!;

        public DateTime DateOfBirth { get; set; }

        public string? Email { get; set; }

        public string PhoneNumber { get; set; } = null!;

        public string? ReferredBy { get; set; }

        public string? Picture { get; set; } = "noimage.png";
        public IFormFile? PictureFile { get; set; }
        public string NidNumber { get; set; } = null!;

        public string? Division { get; set; }

        public string? District { get; set; }

        public string? City { get; set; }

        public string ClientPaymentsJson { get; set;}

        
    }

    public class ClientReadDto
    {
        public int ClientId { get; set; }

        public string ClientFname { get; set; } = null!;

        public string ClientLname { get; set; } = null!;

        public DateTime DateOfBirth { get; set; }

        public string? Email { get; set; }

        public string PhoneNumber { get; set; } = null!;

        public string? ReferredBy { get; set; }

        public string? Picture { get; set; } = "noimage.png";
        public string PictureUrl => $"/images/{Picture}";
        public string NidNumber { get; set; } = null!;

        public string? Division { get; set; }

        public string? District { get; set; }

        public string? City { get; set; }
        public List<ClientPaymentReadDto> ClientPayments { get; set; }
    }

    public class ClientPaymentDto
    {
        public int PaymentId { get; set; }
        public decimal Amount { get; set; }

        public DateTime PaymentDate { get; set; }

        public string ReceiptNumber { get; set; } = null!;

        public string TransactionNo { get; set; } = null!;

        public string? Remarks { get; set; }
    }

    public class ClientPaymentReadDto
    {
        public int PaymentId { get; set; }
        public string PaymentHead { get; set; } = null!;

        public decimal Amount { get; set; }

        public DateTime PaymentDate { get; set; }

        public string ReceiptNumber { get; set; } = null!;

        public string TransactionNo { get; set; } = null!;

        public string? Remarks { get; set; }
    }

    public class PaymentReadDto 
    {
        public int PaymentId { get; set; }
        public string PaymentHead { get; set; } = null!;
    }
}
