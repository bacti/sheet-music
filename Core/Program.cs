using System;
using System.IO;

namespace Core
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            try 
            {
                StreamReader sr = new StreamReader("../../../Assets/StreamingAssets/TestNotes.abc");
                String abctxt = sr.ReadToEnd();
                AbcNotation abc = AbcNotation.Parse(abctxt);
                Console.WriteLine(abctxt);
                Console.WriteLine(abc.Info());
            }
            catch (Exception e)
            {
                Console.WriteLine("Exception: " + e.Message);
            }
        }
    }
}
