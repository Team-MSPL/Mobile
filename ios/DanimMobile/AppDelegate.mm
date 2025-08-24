#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>

#import <Firebase.h>
#import <RNKakaoLogins.h>
#import <GoogleMaps/GoogleMaps.h>
#import "RNSplashScreen.h"
#import "DanimMobile-Swift.h"
#import "RNFBMessagingModule.h"
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
     openURL:(NSURL *)url
     options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
 if([RNKakaoLogins isKakaoTalkLoginUrl:url]) {
    return [RNKakaoLogins handleOpenUrl: url];
 }
  if ([RCTLinkingManager application:application openURL:url sourceApplication:nil annotation:nil]) {
     return YES;
   }
 return NO;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@"70367155908-li7to5i4bq75mpog69prtpmo7t7hnq5e.apps.googleusercontent.com"]; // add this line using the api key obtained from Google Console
  [FIRApp configure];
  self.moduleName = @"DanimMobile";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  self.initialProps = [RNFBMessagingModule addCustomPropsToUserProps:nil withLaunchOptions:launchOptions];
  BOOL success = [super application:application didFinishLaunchingWithOptions:launchOptions];
   // return [super application:application didFinishLaunchingWithOptions:launchOptions];

   // Following code was added for RN splash screen lottie
   if (success) {
     //This is where we will put the logic to get access to rootview
     UIView *rootView = self.window.rootViewController.view;
     
     rootView.backgroundColor = [UIColor whiteColor]; // change with your desired backgroundColor
  
     Dynamic *t = [Dynamic new];
     UIView *animationUIView = (UIView *)[t createAnimationViewWithRootView:rootView lottieName:@"loading"]; // change lottieName to your lottie files name
  
     // register LottieSplashScreen to RNSplashScreen
     [RNSplashScreen showLottieSplash:animationUIView inRootView:rootView];
     // casting UIView type to AnimationView type
     LottieAnimationView *animationView = (LottieAnimationView *) animationUIView;
     // play
     [t playWithAnimationView:animationView];
     // If you want the animation layout to be forced to remove when hide is called, use this code
     [RNSplashScreen setAnimationFinished:true];
   }
  
   return success;

  
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
  return YES;
  //return [application:application didFinishLaunchingWithOptions:launchOptions];

}


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];

#endif
}

@end
