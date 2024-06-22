async function notf() {
    const OneSignal = require('@onesignal/node-onesignal');
  
    const configuration = OneSignal.createConfiguration({
      userAuthKey: 'MzM1MzMzNzEtOGZhYy00MzA5LWI4M2QtNmY2NzQ4ODQxYWFk',
      restApiKey: 'YTkwYmYxN2ItNDg1Ny00ZWZmLThhYWQtMDFiZWViNDlmOTA3',
    });
  
    const client = new OneSignal.DefaultApi(configuration);
  
    const app = await client.getApp('221aef1e-a703-42a7-bdad-57f45eddbadd');
  
    const notification = new OneSignal.Notification({
        isAnyWeb:true
    });
      notification.name = "test_notification_" + Math.round(Math.random()*999999999);
      notification.app_id = app.id;
      notification.target_channel = "push"
      notification.include_aliases = { "onesignal_id": ["e89a305a-75d2-4c0d-a329-1ef2a873a212"] }
      notification.headings = {
        en: "Gig'em Ags"
      }
      notification.data= {"foo": "bar"}
      notification.contents= {
        en: 'Your notification message here', // Replace with your actual message
      }
      // Send the notification
      client.createNotification(notification)
        .then(response => {
          console.log('Notification sent:',response,notification);
        })
        .catch(error => {
          console.error('Error sending notification:', error);
        });
      
  }
  
  notf();
  