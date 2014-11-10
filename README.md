fybridjs
========

`fybridjs` is an open source browser fingerprinting (or fingerprinting) library. Fingerprinting can be used for identifying the user's browser and is useful for fraud detection and delivering more personalized services to the users (e.g., targeted advertisement).  

Conventional browser identification methods mainly rely on client-side identifiers such as browser and Flash cookies. However, a careful or attentive user can see the list of client-side identifiers on her browser and simple delete them. Or, she can operate in the private mode of the modern browsers to block the cookies. 

In contrast, fingerprinting is invisible to users and does not leave any footprint on the browser, making it hard to detect and prevent and a powerful means of identification.

`fybridjs` first exploits the following Web technologies for collecting information through the browser and generating a unique identifier for the browser:

-Browser built-in JavaScript objects (jsobj)
-HTML5 canvas element (canvas)
-Flash plugin (flash)
-JavaScript-based font detection (jsfonts)


##How to use it:

In order to use `fybridjs`, simply add the JavaScript file of `fybridjs` to your project:

```
<script src="fybridjs.js"></script>
```

Then, add the following codes to the body of your webpage:
```
        <script>
            document.addEventListener("fingerprint_is_ready", function(e) {
                console.log('id -> ' + e.detail.id); // here is the generated id by fybridjs
            });

            window.onload = function (){
                var ID = new fybridjs();
                ID.setID('canvas', 'flash', 'jsobj','encrypt', 'jsfonts');
            };
            
        </script>
```
