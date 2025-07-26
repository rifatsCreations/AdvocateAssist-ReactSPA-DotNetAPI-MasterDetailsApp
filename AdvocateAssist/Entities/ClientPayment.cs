using System;
using System.Collections.Generic;

namespace AdvocateAssist.Entities;

public partial class ClientPayment
{
    public int ClientPaymentId { get; set; }

    public int ClientId { get; set; }

    public int PaymentId { get; set; }

    public decimal Amount { get; set; }

    public DateTime PaymentDate { get; set; }

    public string ReceiptNumber { get; set; } = null!;

    public string TransactionNo { get; set; } = null!;

    public string? Remarks { get; set; }

    public virtual Client Client { get; set; } = null!;

    public virtual Payment Payment { get; set; } = null!;
}
