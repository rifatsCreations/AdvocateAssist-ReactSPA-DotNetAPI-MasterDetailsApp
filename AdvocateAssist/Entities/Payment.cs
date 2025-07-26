using System;
using System.Collections.Generic;

namespace AdvocateAssist.Entities;

public partial class Payment
{
    public int PaymentId { get; set; }

    public string PaymentHead { get; set; } = null!;

    public virtual ICollection<ClientPayment> ClientPayments { get; set; } = new List<ClientPayment>();
}
