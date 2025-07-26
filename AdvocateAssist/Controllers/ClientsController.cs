using AdvocateAssist.Data;
using AdvocateAssist.Entities;
using AdvocateAssist.Models.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace AdvocateAssist.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly AdvocateAssistContext _context;
        private readonly IWebHostEnvironment _env;

        public ClientsController(AdvocateAssistContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClientReadDto>>> GetClients() 
        {
            var clients = await _context.Clients.Include(c => c.ClientPayments).ThenInclude(cp => cp.Payment).ToListAsync();
            
          var clientReadDtos=clients.Select(c=>new ClientReadDto 
          {
            ClientId=c.ClientId,
            ClientFname=c.ClientFname,
            ClientLname=c.ClientLname,
            DateOfBirth=c.DateOfBirth,
            Email=c.Email,
            PhoneNumber=c.PhoneNumber,
            ReferredBy=c.ReferredBy,
            Picture=c.Picture,
            NidNumber=c.NidNumber,
            Division=c.Division,
            District=c.District,
            City=c.City,
            ClientPayments=c.ClientPayments.Select(cp=> new ClientPaymentReadDto 
            {
                PaymentId=cp.PaymentId,
                PaymentHead=cp.Payment?.PaymentHead,
                Amount=cp.Amount,
                PaymentDate=cp.PaymentDate,
                ReceiptNumber=cp.ReceiptNumber,
                TransactionNo=cp.TransactionNo,
                Remarks=cp.Remarks
            }).ToList()


          }).ToList();
            return Ok(clientReadDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ClientReadDto>>GetClient(int id)
        {
            var client = await _context.Clients.Include(c => c.ClientPayments).ThenInclude(cp => cp.Payment).FirstOrDefaultAsync(c => c.ClientId == id);

            if (client == null) 
            {
                return NotFound();
            }
            var clientReadDto = new ClientReadDto
            {
                ClientId = client.ClientId,
                ClientFname = client.ClientFname,
                ClientLname = client.ClientLname,
                DateOfBirth = client.DateOfBirth,
                Email = client.Email,
                PhoneNumber = client.PhoneNumber,
                ReferredBy = client.ReferredBy,
                Picture = client.Picture,
                NidNumber = client.NidNumber,
                Division = client.Division,
                District = client.District,
                City = client.City,
                ClientPayments = client.ClientPayments.Select(cp => new ClientPaymentReadDto
                {
                    PaymentId = cp.PaymentId,
                    PaymentHead = cp.Payment?.PaymentHead,
                    Amount = cp.Amount,
                    PaymentDate = cp.PaymentDate,
                    ReceiptNumber = cp.ReceiptNumber,
                    TransactionNo = cp.TransactionNo,
                    Remarks = cp.Remarks
                }).ToList()
            };
            return clientReadDto;
        }

        [HttpPost]

        public async Task<ActionResult<ClientReadDto>> CreateClient([FromForm] ClientCreateUpdateDto clientDto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string uniqueFileName = "noimage.png";
            if (clientDto.PictureFile != null) 
            {
                uniqueFileName= await SavePictureFile(clientDto.PictureFile);
            }
            var client = new Client
            {
                ClientFname = clientDto.ClientFname,
                ClientLname = clientDto.ClientLname,
                DateOfBirth = clientDto.DateOfBirth,
                Email = clientDto.Email,
                PhoneNumber = clientDto.PhoneNumber,
                ReferredBy = clientDto.ReferredBy,
                Picture = uniqueFileName,
                NidNumber = clientDto.NidNumber,
                Division = clientDto.Division,
                District = clientDto.District,
                City = clientDto.City,
                ClientPayments = new List<ClientPayment>()
            };
            if (!string.IsNullOrEmpty(clientDto.ClientPaymentsJson)) 
            {
                var clientPaymentDtos = JsonConvert.DeserializeObject<List<ClientPaymentDto>>(clientDto.ClientPaymentsJson);
                foreach (var paymentDto in clientPaymentDtos) 
                {
                    client.ClientPayments.Add(new ClientPayment
                    {
                        PaymentId = paymentDto.PaymentId,
                        Amount = paymentDto.Amount,
                        PaymentDate = paymentDto.PaymentDate,
                        ReceiptNumber = paymentDto.ReceiptNumber,
                        TransactionNo = paymentDto.TransactionNo,
                        Remarks = paymentDto.Remarks,
                    });
                }
            }
            _context.Clients.Add(client);
            await _context.SaveChangesAsync();
            var savedClient=await _context.Clients.Include(c=>c.ClientPayments).ThenInclude(cp=>cp.Payment).FirstOrDefaultAsync(c=>c.ClientId == client.ClientId);

            var createClientReadDto = new ClientReadDto
            {
                ClientId = savedClient.ClientId,
                ClientFname = savedClient.ClientFname,
                ClientLname = savedClient.ClientLname,
                DateOfBirth = savedClient.DateOfBirth,
                Email = savedClient.Email,
                PhoneNumber = savedClient.PhoneNumber,
                ReferredBy = savedClient.ReferredBy,
                Picture = savedClient.Picture,
                NidNumber = savedClient.NidNumber,
                Division = savedClient.Division,
                District = savedClient.District,
                City = savedClient.City,
                ClientPayments = savedClient.ClientPayments.Select(cp => new ClientPaymentReadDto
                {
                    PaymentId = cp.PaymentId,
                    PaymentHead = cp.Payment?.PaymentHead,
                    Amount = cp.Amount,
                    PaymentDate = cp.PaymentDate,
                    ReceiptNumber = cp.ReceiptNumber,
                    TransactionNo = cp.TransactionNo,
                    Remarks = cp.Remarks
                }).ToList()

            };
            return CreatedAtAction(nameof(GetClient), new { id = createClientReadDto.ClientId }, createClientReadDto);


        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClient(int id, [FromForm] ClientCreateUpdateDto clientDto)
        {
            if (id != clientDto.ClientId && clientDto.ClientId != 0)
            {
                return BadRequest("Client ID mismatch");
            }

            var existingClient = await _context.Clients.Include(c => c.ClientPayments).FirstOrDefaultAsync(c => c.ClientId == id);
            if (existingClient == null)
            {
                return NotFound();
            }

            if (clientDto.PictureFile != null)
            {
                if (existingClient.Picture != "noimage.png")
                {
                    DeletePictureFile(existingClient.Picture);
                }
                existingClient.Picture = await SavePictureFile(clientDto.PictureFile);
            }
            else if (string.IsNullOrEmpty(clientDto.Picture))
            {
                existingClient.Picture = clientDto.Picture;
            }

            // Update client basic info
            existingClient.ClientFname = clientDto.ClientFname;
            existingClient.ClientLname = clientDto.ClientLname;
            existingClient.DateOfBirth = clientDto.DateOfBirth;
            existingClient.Email = clientDto.Email;
            existingClient.PhoneNumber = clientDto.PhoneNumber;
            existingClient.ReferredBy = clientDto.ReferredBy;
            existingClient.NidNumber = clientDto.NidNumber;
            existingClient.Division = clientDto.Division;
            existingClient.District = clientDto.District;
            existingClient.City = clientDto.City;

            // Remove old payments from database explicitly
            _context.ClientPayments.RemoveRange(existingClient.ClientPayments);
            await _context.SaveChangesAsync(); 

            existingClient.ClientPayments.Clear();

            // Add new payments from DTO
            if (!string.IsNullOrEmpty(clientDto.ClientPaymentsJson))
            {
                var clientPaymentDtos = JsonConvert.DeserializeObject<List<ClientPaymentDto>>(clientDto.ClientPaymentsJson);
                foreach (var paymentDto in clientPaymentDtos)
                {
                    existingClient.ClientPayments.Add(new ClientPayment
                    {
                        ClientId = existingClient.ClientId,
                        PaymentId = paymentDto.PaymentId,
                        Amount = paymentDto.Amount,
                        PaymentDate = paymentDto.PaymentDate,
                        ReceiptNumber = paymentDto.ReceiptNumber,
                        TransactionNo = paymentDto.TransactionNo,
                        Remarks = paymentDto.Remarks,
                    });
                }
            }

            try
            {
                await _context.SaveChangesAsync();  
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }


        [HttpDelete("{id}")]

        public async Task<IActionResult> DeleteClient(int id) 
        {
            var client = await _context.Clients.Include(c => c.ClientPayments).FirstOrDefaultAsync(c => c.ClientId == id);
            if (client == null) 
            {
                return NotFound();
            }
            if (client.Picture != "noimage.png") 
            {
                DeletePictureFile(client.Picture);
            }
            _context.ClientPayments.RemoveRange(client.ClientPayments);
            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool ClientExists(int id)
        {
           return  _context.Clients.Any(c => c.ClientId == id);
        }

        private void DeletePictureFile(string? picture)
        {
            var filePath = Path.Combine(_env.WebRootPath, "images", picture);
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
        }

        private async Task<string> SavePictureFile(IFormFile pictureFile)
        {
           var uploadsFolder=Path.Combine(_env.WebRootPath, "images");
            if (!Directory.Exists(uploadsFolder)) 
            {
                Directory.CreateDirectory(uploadsFolder);
            }
            var uniqueFileName = Guid.NewGuid().ToString() + "_" + pictureFile.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);
            using (var fileStream = new FileStream(filePath, FileMode.Create)) 
            {
                await pictureFile.CopyToAsync(fileStream);
            }
            return uniqueFileName;
        }
    }


}
