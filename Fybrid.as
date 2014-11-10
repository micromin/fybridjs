package
{
   import flash.display.Sprite;
   import flash.system.Capabilities;
   import flash.system.System;
   import flash.ui.Mouse;
   import flash.ui.Keyboard;
   
   import flash.text.Font;
   import flash.text.FontType;
   import flash.text.FontStyle;

   import flash.external.ExternalInterface;
   import flash.system.Security;
   
   public class Fybrid extends Sprite
   {
      
      public function Fybrid()
      {
         // handling security issues
         super();
         Security.allowDomain("*");
         Security.allowInsecureDomain("*");
         if(ExternalInterface.available)
         {
            ExternalInterface.addCallback("get_data", this.get_data);
         }
         //collecting data
         this.set_data();
      }
      
      private var flash_data:String;
      
      private function set_data() : void
      {
         var t_data:String = "";
         t_data = "avHardwareDisable: " + Capabilities.avHardwareDisable + "<n>" + "hasAccessibility: " + Capabilities.hasAccessibility + "<n>" + "hasAudio: " + Capabilities.hasAudio + "<n>" + "hasAudioEncoder: " + Capabilities.hasAudioEncoder + "<n>" + "hasEmbeddedVideo: " + Capabilities.hasEmbeddedVideo + "<n>" + "hasIME: " + Capabilities.hasIME + "<n>" + "hasMP3: " + Capabilities.hasMP3 + "<n>" + "hasPrinting: " + Capabilities.hasPrinting + "<n>" + "hasScreenBroadcast: " + Capabilities.hasScreenBroadcast + "<n>" + "hasScreenPlayback: " + Capabilities.hasScreenPlayback + "<n>" + "hasStreamingAudio: " + Capabilities.hasStreamingAudio + "<n>" + "hasStreamingVideo: " + Capabilities.hasStreamingVideo + "<n>" + "hasTLS: " + Capabilities.hasTLS + "<n>" + "hasVideoEncoder: " + Capabilities.hasVideoEncoder + "<n>" + "isDebugger: " + Capabilities.isDebugger + "<n>" + "isEmbeddedInAcrobat: " + Capabilities.isEmbeddedInAcrobat + "<n>" + "language: " + Capabilities.language + "<n>" + "localFileReadDisable: " + Capabilities.localFileReadDisable + "<n>" + "manufacturer: " + Capabilities.manufacturer + "<n>" + "maxLevelIDC: " + Capabilities.maxLevelIDC + "<n>" + "os: " + Capabilities.os + "<n>" + "pixelAspectRatio: " + Capabilities.pixelAspectRatio + "<n>" + "playerType: " + Capabilities.playerType + "<n>" + "screenColor: " + Capabilities.screenColor + "<n>" + "screenDPI: " + Capabilities.screenDPI + "<n>" + "screenResolutionX: " + Capabilities.screenResolutionX + "<n>" + "screenResolutionY: " + Capabilities.screenResolutionY + "<n>" + "serverString: " + Capabilities.serverString + "<n>" + "touchscreenType: " + Capabilities.touchscreenType + "<n>" + "cpuArchitecture: " + Capabilities.cpuArchitecture + "<n>" + "languages: " + Capabilities.language + "<n>" + "supports32BitProcesses: " + Capabilities.supports32BitProcesses + "<n>" + "supports64BitProcesses: " + Capabilities.supports64BitProcesses + "<n>" + "version: " + Capabilities.version + "<n>" + "System.vmVersion: " + System.vmVersion + "<n>" + "Mouse.cursor: " + Mouse.cursor + "<n>" + "Keyboard.physicalKeyboardType: " + Keyboard.physicalKeyboardType + "<n>" + "flash.ui.Keyboard.hasVirtualKeyboard: " + Keyboard.hasVirtualKeyboard + "<n>" + "Mouse.supportsCursor: " + Mouse.supportsCursor + "<n>";
         
         var font_str:String = "fonts:";
         var font_array:Array = get_device_fonts();
         for each(var c_font:String in font_array)
         {
            font_str += c_font + ",";
         }
         t_data += font_str;
         
         this.flash_data = t_data;

         //trace("Flash Data : " + this.flash_data);
         if(ExternalInterface.available)
         {
            ExternalInterface.call("get_flash_data");
         }
      }
      
      private function get_data() : String
      {
         return this.flash_data;
      }
      // function for collecting system fonts
      private function get_device_fonts() : Array
      {
         var font:Font = null;
         var all_fonts:Array = Font.enumerateFonts(true); // getting embedded and device fonts
         var ret_fonts:Array = []; // returning device fonts
         for each(font in all_fonts)
         {
            if(!((font.fontType == FontType.EMBEDDED) || (!(font.fontStyle == FontStyle.REGULAR))))
            {
               ret_fonts.push(font.fontName);
           }
         }
         return ret_fonts;
      }
      
      
      
      
   }
}