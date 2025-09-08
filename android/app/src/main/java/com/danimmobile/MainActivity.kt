package com.danimmobile

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.ReactRootView
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView
import org.devio.rn.splashscreen.SplashScreen

class MainActivity : ReactActivity() {

    init {
        SplashScreen.show(this, R.id.lottie)
        SplashScreen.setAnimationFinished(true)
    }

    override fun getMainComponentName(): String = "DanimMobile"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(null)
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return object : ReactActivityDelegate(this, mainComponentName) {
            override fun createRootView(): ReactRootView {
                return RNGestureHandlerEnabledRootView(this@MainActivity)
            }
        }
    }
}
