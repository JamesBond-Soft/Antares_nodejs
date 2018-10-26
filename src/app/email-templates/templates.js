const configUrlCallBack = require('../../config/config-url-callbacks');
let templates={};

templates.template1=(urlPicture, title, message, linkBtn, textBtn, name)=>{
    var tmpl=``;

    tmpl=`<div marginwidth="0" marginheight="0" style="height:100%;width:100%;font-family:Arial,Helvetica,sans-serif;background-color:#efefef;margin:0;padding:0" bgcolor="#EFEFEF">

    <span class="m_1332328078605135572mcnPreviewText" style="display:none!important;font-size:0px;line-height:0px;max-height:0px;max-width:0px;opacity:0;overflow:hidden"></span>  
    
    <center>
      <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="m_1332328078605135572bodyTable" style="border-collapse:collapse;height:100%;width:100%;font-family:Arial,Helvetica,sans-serif;background-color:#efefef;margin:0;padding:0" bgcolor="#EFEFEF">
        <tbody><tr>
          <td align="center" valign="top" id="m_1332328078605135572bodyCell" style="height:100%;width:100%;font-family:Arial,Helvetica,sans-serif;border-top-width:0;margin:0;padding:0">
  
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
              <tbody><tr>
                <td align="center" valign="top" style="padding-bottom:10px">
  
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" id="m_1332328078605135572templatePreheader" style="border-collapse:collapse;background-color:transparent;border-top-width:0;border-bottom-width:0" bgcolor="transparent">
                    <tbody><tr>
                      <td align="center" valign="top">
                        <table border="0" cellpadding="0" cellspacing="0" width="600" class="m_1332328078605135572templateContainer" style="border-collapse:collapse">
                          <tbody><tr>
                            <td valign="top" class="m_1332328078605135572preheaderContainer" style="padding-top:20px;padding-bottom:0px">
                              <table border="0" cellpadding="0" cellspacing="0" width="100%" class="m_1332328078605135572mcnTextBlock" style="min-width:100%;border-collapse:collapse">
                                <tbody class="m_1332328078605135572mcnTextBlockOuter">
                                  <tr>
                                    <td valign="top" class="m_1332328078605135572mcnTextBlockInner" style="padding-top:9px">
                                      
  
                                      
                                      <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_1332328078605135572mcnTextContentContainer">
                                        <tbody>
                                          <tr>
  
                                            <td valign="top" class="m_1332328078605135572mcnTextContent" style="text-align:left;word-break:break-word;color:#808080;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:125%;padding:0px 18px 9px" align="left">
          </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      
  
                                      
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody></table>
                      </td>
                    </tr>
                  </tbody></table>
  
                </td>
              </tr>
  

              <tr>
                <td align="center" valign="top" style="padding-left:10px;padding-right:10px">
  
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" id="m_1332328078605135572templateColumns" style="border-collapse:collapse;background-color:transparent;border-top-width:0;border-bottom-width:0" bgcolor="transparent">
                    <tbody><tr>
                      <td align="center" valign="top" style="padding-top:10px;padding-bottom:10px">
                        <table border="0" cellpadding="0" cellspacing="0" width="600" class="m_1332328078605135572templateContainerBody" style="background-color:#ffffff;padding-top:20px;border-collapse:collapse;border-radius:3px;overflow:hidden" bgcolor="#FFFFFF">
                          <tbody><tr>
                            <td align="left" valign="top" class="m_1332328078605135572columnsContainer" width="50%">
                              <table align="right" border="0" cellpadding="0" cellspacing="0" width="100%" class="m_1332328078605135572templateColumn" style="border-collapse:collapse">
                                <tbody><tr>
                                  <td valign="top" class="m_1332328078605135572leftColumnContainer" style="padding-bottom:0px"><span class="im">
  
  
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="m_1332328078605135572mcnTextBlock" style="min-width:100%;border-collapse:collapse">
    <tbody class="m_1332328078605135572mcnTextBlockOuter">
      <tr>
        <td valign="top" class="m_1332328078605135572mcnTextBlockInner" style="padding-top:9px">
          
  
          
          <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_1332328078605135572mcnTextContentContainer">
            <tbody>
              <tr>
  
                <td valign="top" class="m_1332328078605135572mcnTextContent" style="word-break:break-word;color:#404040;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:200%;text-align:left;font-weight:normal;padding:0 18px 9px" align="left">
  
                  <p style="color:#404040;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:200%;text-align:left;font-weight:normal;margin:10px 0;padding:0" align="left">Hola `+name+`</p>

                  <p style="color:#404040;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:200%;text-align:left;font-weight:normal;margin:10px 0;padding:0" align="left">  `+title+`:</p>
                </td>
              </tr>
            </tbody>
          </table>
          
  
          
        </td>
      </tr>
    </tbody>
  </table>
  </span><table border="0" cellpadding="0" cellspacing="0" width="100%" class="m_1332328078605135572mcnButtonBlock" style="min-width:100%;border-collapse:collapse">
  
    <tbody><tr>
      <td align="center" valign="top">
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
          <tbody><tr>
            <td align="center" valign="top">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" class="m_1332328078605135572templateContainer" style="border-collapse:collapse">
                <tbody><tr>
                  <td align="center" valign="top" style="padding-top:px">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
                      <tbody><tr>
                        <td valign="top" class="m_1332328078605135572bodyContainer">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" class="m_1332328078605135572mcnCaptionBlock" style="border-collapse:collapse">
                            <tbody class="m_1332328078605135572mcnCaptionBlockOuter">
                              <tr>
                                <td class="m_1332328078605135572mcnCaptionBlockInner m_1332328078605135572bidBlock" valign="top" style="max-width:600px;padding:18px">
  
  
                                  <table border="0" cellpadding="0" cellspacing="0" class="m_1332328078605135572mcnCaptionLeftContentOuter" width="100%" style="border-collapse:collapse">
                                    <tbody>
                                      <tr>
                                        <td valign="top" class="m_1332328078605135572mcnCaptionLeftContentInner" style="padding:5px 0px">
                                 
                                          <table class="m_1332328078605135572mcnTextContentContainer" align="right" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse:collapse;padding:15px 0px 5px">
                                            <tbody>
                                              <tr>
                                                <td valign="middle" class="m_1332328078605135572mcnTextContent" style="font-weight:bold;text-align:left;word-break:break-word;color:#404040;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:200%" align="left">
                                                `+message+`
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
  
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody></table>
                  </td>
                </tr>
              </tbody></table>
            </td>
          </tr>
        </tbody></table>
        
      </td>
    </tr>
  </tbody></table><span class="im">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" class="m_1332328078605135572mcnTextBlock" style="min-width:100%;border-collapse:collapse">
    <tbody class="m_1332328078605135572mcnTextBlockOuter">
      <tr>
        <td valign="top" class="m_1332328078605135572mcnTextBlockInner" style="padding-top:9px">
          
  
          
  
          
  
          
        </td>
      </tr>
    </tbody>
  </table>
  
  
  <table border="0" cellpadding="0" cellspacing="0" width="100%" class="m_1332328078605135572mcnButtonBlock" style="min-width:100%;border-collapse:collapse;">
      <tbody class="m_1332328078605135572mcnButtonBlockOuter">
          <tr>
              <td style="padding:18px;text-align: center;" valign="top" align="left" class="m_1332328078605135572mcnButtonBlockInner">
                  <table border="0" cellpadding="0" cellspacing="0" class="m_1332328078605135572mcnButtonContentContainer" style="border-collapse:separate!important;border-radius:3px;background-color:#E40F05;display: inline-block;" bgcolor="#253556">
                      <tbody>
                          <tr>
                              <td align="center" valign="middle" class="m_1332328078605135572mcnButtonContent" style="font-family:'Open Sans','Helvetica Neue',Arial,Helvetica,sans-serif;color:#ffffff;font-size:13px;padding:15px">
                                  <a class="m_1332328078605135572mcnButton" title="" href="`+linkBtn+`" style="text-transform:uppercase;font-weight:bold;letter-spacing:normal;line-height:100%;text-align:center;text-decoration:none;color:#ffffff;display:block" target="_blank" >  `+textBtn+`</a>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </td>
          </tr>
      </tbody>
  </table>
  
  
  
                                  </span></td>
                                </tr>
                              </tbody></table>
  
                            </td>
                          </tr>
                        </tbody></table>
  
                      </td>
                    </tr>
                  </tbody></table>
  
                </td>
              </tr>
  
  
  
  
  
  
              <tr>
                <td align="center" valign="top" style="padding-bottom:0px">
  
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" id="m_1332328078605135572templateFooter" style="border-collapse:collapse;background-color:transparent;border-top-width:0;border-bottom-width:0" bgcolor="transparent">
                    <tbody><tr>
                      <td align="center" valign="top">
                        <table border="0" cellpadding="0" cellspacing="0" width="600" class="m_1332328078605135572templateContainer" style="border-collapse:collapse">
                          <tbody><tr>
                            <td valign="top" class="m_1332328078605135572footerContainer" style="padding-top:30px;padding-bottom:10px">
                              <table border="0" cellpadding="0" cellspacing="0" width="100%" class="m_1332328078605135572mcnTextBlock" style="min-width:100%;border-collapse:collapse">
                                <tbody class="m_1332328078605135572mcnTextBlockOuter">
                                  <tr>
                                    <td valign="top" class="m_1332328078605135572mcnTextBlockInner" style="padding-top:9px">
                                      
  
                                      
                                      <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_1332328078605135572mcnTextContentContainer">
                                        <tbody>
                                
                                          <tr>
                                            <td valign="top" class="m_1332328078605135572mcnTextContent" style="word-break:break-word;color:#686868;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:125%;text-align:left;padding:0 18px 9px" align="left">
  
                                              <p style="font-size:11px;color:#686868;font-family:Arial,Helvetica,sans-serif;line-height:125%;text-align:center;margin:10px 0;padding:0" align="center">
                                                  Copyright © 2018 Antares. All rights reserved
  
                                              </p>
                                              <p style="font-size:11px;color:#686868;font-family:Arial,Helvetica,sans-serif;line-height:125%;text-align:center;margin:10px 0;padding:0" align="left">
  
                                                <a href="" alt="Antares en Twitter" style="text-decoration:none;padding-right:20px;color:#aaaaaa;font-weight:normal" target="_blank" >
                                                              <img src="https://gallery.mailchimp.com/fddb141830b67e52809a5a1c3/images/680af8d8-99fd-424a-bbc9-7f497a697a97.png" width="22" style="max-width:22px;padding-bottom:0;display:inline!important;vertical-align:bottom;height:auto!important;outline:none;text-decoration:none;border:0" class="m_1332328078605135572mcnImage CToWUd">
                                                            </a>
  
  
                                                <a href="" alt="Antares en Facebook" style="text-decoration:none;padding-right:20px;color:#aaaaaa;font-weight:normal" target="_blank" >
                                                              <img src="https://gallery.mailchimp.com/fddb141830b67e52809a5a1c3/images/9fc24e66-6bba-4c71-b0ec-354ebddf682e.png" width="9" style="max-width:9px;padding-bottom:0;display:inline!important;vertical-align:bottom;height:auto!important;outline:none;text-decoration:none;border:0" class="m_1332328078605135572mcnImage CToWUd">
                                                  </a>
  
                                            
  
  
                                              </p>
                                        
  
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      
  
                                      
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody></table>
                      </td>
                    </tr>
                  </tbody></table>
  
                </td>
              </tr>
            </tbody></table>
  
          </td>
        </tr>
      </tbody></table>
    </center>
 
  </div></div>`;

    return tmpl;
};



templates.template2=(message, name)=>{
  var tmpl=``;

  tmpl=`<div marginwidth="0" marginheight="0" style="height:100%;width:100%;font-family:Arial,Helvetica,sans-serif;background-color:#efefef;margin:0;padding:0" bgcolor="#EFEFEF">

  <span class="m_1332328078605135572mcnPreviewText" style="display:none!important;font-size:0px;line-height:0px;max-height:0px;max-width:0px;opacity:0;overflow:hidden"></span>  
  
  <center>
    <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="m_1332328078605135572bodyTable" style="border-collapse:collapse;height:100%;width:100%;font-family:Arial,Helvetica,sans-serif;background-color:#efefef;margin:0;padding:0" bgcolor="#EFEFEF">
      <tbody><tr>
        <td align="center" valign="top" id="m_1332328078605135572bodyCell" style="height:100%;width:100%;font-family:Arial,Helvetica,sans-serif;border-top-width:0;margin:0;padding:0">

          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
            <tbody><tr>
              <td align="center" valign="top" style="padding-bottom:10px">

                <table border="0" cellpadding="0" cellspacing="0" width="100%" id="m_1332328078605135572templatePreheader" style="border-collapse:collapse;background-color:transparent;border-top-width:0;border-bottom-width:0" bgcolor="transparent">
                  <tbody><tr>
                    <td align="center" valign="top">
                      <table border="0" cellpadding="0" cellspacing="0" width="600" class="m_1332328078605135572templateContainer" style="border-collapse:collapse">
                        <tbody><tr>
                          <td valign="top" class="m_1332328078605135572preheaderContainer" style="padding-top:20px;padding-bottom:0px">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" class="m_1332328078605135572mcnTextBlock" style="min-width:100%;border-collapse:collapse">
                              <tbody class="m_1332328078605135572mcnTextBlockOuter">
                                <tr>
                                  <td valign="top" class="m_1332328078605135572mcnTextBlockInner" style="padding-top:9px">
                                    

                                    
                                    <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_1332328078605135572mcnTextContentContainer">
                                      <tbody>
                                        <tr>

                                          <td valign="top" class="m_1332328078605135572mcnTextContent" style="text-align:left;word-break:break-word;color:#808080;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:125%;padding:0px 18px 9px" align="left">

                            
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    

                                    
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody></table>
                    </td>
                  </tr>
                </tbody></table>

              </td>
            </tr>


            <tr>
              <td align="center" valign="top" style="padding-left:10px;padding-right:10px">

                <table border="0" cellpadding="0" cellspacing="0" width="100%" id="m_1332328078605135572templateColumns" style="border-collapse:collapse;background-color:transparent;border-top-width:0;border-bottom-width:0" bgcolor="transparent">
                  <tbody><tr>
                    <td align="center" valign="top" style="padding-top:10px;padding-bottom:10px">
                      <table border="0" cellpadding="0" cellspacing="0" width="600" class="m_1332328078605135572templateContainerBody" style="background-color:#ffffff;padding-top:20px;border-collapse:collapse;border-radius:3px;overflow:hidden" bgcolor="#FFFFFF">
                        <tbody><tr>
                          <td align="left" valign="top" class="m_1332328078605135572columnsContainer" width="50%">
                            <table align="right" border="0" cellpadding="0" cellspacing="0" width="100%" class="m_1332328078605135572templateColumn" style="border-collapse:collapse">
                              <tbody><tr>
                                <td valign="top" class="m_1332328078605135572leftColumnContainer" style="padding-bottom:0px"><span class="im">


                                  <table border="0" cellpadding="0" cellspacing="0" width="100%" class="m_1332328078605135572mcnTextBlock" style="min-width:100%;border-collapse:collapse">
  <tbody class="m_1332328078605135572mcnTextBlockOuter">
    <tr>
      <td valign="top" class="m_1332328078605135572mcnTextBlockInner" style="padding-top:9px">
        

        
        <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_1332328078605135572mcnTextContentContainer">
          <tbody>
            <tr>

              <td valign="top" class="m_1332328078605135572mcnTextContent" style="word-break:break-word;color:#404040;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:200%;text-align:left;font-weight:normal;padding:0 18px 9px" align="left">

                <p style="color:#404040;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:200%;text-align:left;font-weight:normal;margin:10px 0;padding:0" align="left">Hola nuevo mensaje de `+name+`</p>
               
              </td>
            </tr>
          </tbody>
        </table>
        

        
      </td>
    </tr>
  </tbody>
</table>
</span><table border="0" cellpadding="0" cellspacing="0" width="100%" class="m_1332328078605135572mcnButtonBlock" style="min-width:100%;border-collapse:collapse">

  <tbody><tr>
    <td align="center" valign="top">
      
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
        <tbody><tr>
          <td align="center" valign="top">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" class="m_1332328078605135572templateContainer" style="border-collapse:collapse">
              <tbody><tr>
                <td align="center" valign="top" style="padding-top:px">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
                    <tbody><tr>
                      <td valign="top" class="m_1332328078605135572bodyContainer">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="m_1332328078605135572mcnCaptionBlock" style="border-collapse:collapse">
                          <tbody class="m_1332328078605135572mcnCaptionBlockOuter">
                            <tr>
                              <td class="m_1332328078605135572mcnCaptionBlockInner m_1332328078605135572bidBlock" valign="top" style="max-width:600px;padding:18px">


                                <table border="0" cellpadding="0" cellspacing="0" class="m_1332328078605135572mcnCaptionLeftContentOuter" width="100%" style="border-collapse:collapse">
                                  <tbody>
                                    <tr>
                                      <td valign="top" class="m_1332328078605135572mcnCaptionLeftContentInner" style="padding:5px 0px">
                               
                                        <table class="m_1332328078605135572mcnTextContentContainer" align="right" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse:collapse;padding:15px 0px 5px">
                                          <tbody>
                                            <tr>
                                              <td valign="middle" class="m_1332328078605135572mcnTextContent" style="font-weight:bold;text-align:left;word-break:break-word;color:#404040;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:200%" align="left">
                                              `+message+`
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody></table>
                </td>
              </tr>
            </tbody></table>
          </td>
        </tr>
      </tbody></table>
      
    </td>
  </tr>
</tbody></table><span class="im">






                                </span></td>
                              </tr>
                            </tbody></table>

                          </td>
                        </tr>
                      </tbody></table>

                    </td>
                  </tr>
                </tbody></table>

              </td>
            </tr>






            <tr>
              <td align="center" valign="top" style="padding-bottom:0px">

                <table border="0" cellpadding="0" cellspacing="0" width="100%" id="m_1332328078605135572templateFooter" style="border-collapse:collapse;background-color:transparent;border-top-width:0;border-bottom-width:0" bgcolor="transparent">
                  <tbody><tr>
                    <td align="center" valign="top">
                      <table border="0" cellpadding="0" cellspacing="0" width="600" class="m_1332328078605135572templateContainer" style="border-collapse:collapse">
                        <tbody><tr>
                          <td valign="top" class="m_1332328078605135572footerContainer" style="padding-top:30px;padding-bottom:10px">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" class="m_1332328078605135572mcnTextBlock" style="min-width:100%;border-collapse:collapse">
                              <tbody class="m_1332328078605135572mcnTextBlockOuter">
                                <tr>
                                  <td valign="top" class="m_1332328078605135572mcnTextBlockInner" style="padding-top:9px">
                                    

                                    
                                    <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_1332328078605135572mcnTextContentContainer">
                                      <tbody>
                              
                                        <tr>
                                          <td valign="top" class="m_1332328078605135572mcnTextContent" style="word-break:break-word;color:#686868;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:125%;text-align:left;padding:0 18px 9px" align="left">

                                            <p style="font-size:11px;color:#686868;font-family:Arial,Helvetica,sans-serif;line-height:125%;text-align:center;margin:10px 0;padding:0" align="center">
                                                Copyright © 2018 Antares. All rights reserved

                                            </p>
                                            <p style="font-size:11px;color:#686868;font-family:Arial,Helvetica,sans-serif;line-height:125%;text-align:center;margin:10px 0;padding:0" align="left">

                                              <a href="" alt="Antares en Twitter" style="text-decoration:none;padding-right:20px;color:#aaaaaa;font-weight:normal" target="_blank" >
                                                            <img src="https://gallery.mailchimp.com/fddb141830b67e52809a5a1c3/images/680af8d8-99fd-424a-bbc9-7f497a697a97.png" width="22" style="max-width:22px;padding-bottom:0;display:inline!important;vertical-align:bottom;height:auto!important;outline:none;text-decoration:none;border:0" class="m_1332328078605135572mcnImage CToWUd">
                                                          </a>


                                              <a href="" alt="Antares en Facebook" style="text-decoration:none;padding-right:20px;color:#aaaaaa;font-weight:normal" target="_blank" >
                                                            <img src="https://gallery.mailchimp.com/fddb141830b67e52809a5a1c3/images/9fc24e66-6bba-4c71-b0ec-354ebddf682e.png" width="9" style="max-width:9px;padding-bottom:0;display:inline!important;vertical-align:bottom;height:auto!important;outline:none;text-decoration:none;border:0" class="m_1332328078605135572mcnImage CToWUd">
                                                </a>

                                          


                                            </p>
                                      

                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    

                                    
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody></table>
                    </td>
                  </tr>
                </tbody></table>

              </td>
            </tr>
          </tbody></table>

        </td>
      </tr>
    </tbody></table>
  </center>

</div></div>`;

  return tmpl;
};

module.exports = templates;