using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AdvocateAssist.Data;
using AdvocateAssist.Entities;
using AdvocateAssist.Models.DTOs;

namespace AdvocateAssist.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly AdvocateAssistContext _context;

        public PaymentsController(AdvocateAssistContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentReadDto>>> GetPayments() 
        {
            var payments= await _context.Payments.ToListAsync();
            var paymentDtos=payments.Select(p=>new PaymentReadDto
            {
                PaymentId= p.PaymentId,PaymentHead=p.PaymentHead,
            }).ToList();
            return Ok(paymentDtos);
        }

       
    }
}
