Add-Type -Type @"
using System;
using System.Runtime.InteropServices;
namespace WT {
   public class Temp {
      [DllImport("user32.dll")]
      public static extern bool SetWindowText(IntPtr hWnd, string lpString); 
   }
}
"@

$cmd = Start-Process cmd -PassThru
[wt.temp]::SetWindowText($cmd.MainWindowHandle, 'some text')