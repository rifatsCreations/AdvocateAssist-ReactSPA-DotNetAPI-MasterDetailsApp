using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdvocateAssist.Entities;

public partial class Client
{
    public int ClientId { get; set; }

    public string ClientFname { get; set; } = null!;

    public string ClientLname { get; set; } = null!;

    public DateTime DateOfBirth { get; set; }

    public string? Email { get; set; }

    public string PhoneNumber { get; set; } = null!;

    public string? ReferredBy { get; set; }

    public string? Picture { get; set; } = "noimage.png";
    [NotMapped]
    public IFormFile? PictureFile { get; set; }

    public string NidNumber { get; set; } = null!;

    public string? Division { get; set; }

    public string? District { get; set; }

    public string? City { get; set; }

    public virtual ICollection<ClientPayment> ClientPayments { get; set; } = new List<ClientPayment>();
}
