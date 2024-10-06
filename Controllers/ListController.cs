using Microsoft.AspNetCore.Mvc;

namespace InterviewTest.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ListController : ControllerBase
    {
        public ListController()
        {
        }

        /*
         * List API methods goe here
         * */

        // I did not feel the ListController was necerailiy needed as all CRUD operations were on the employees themself, I hope this was okay.
    }
}
