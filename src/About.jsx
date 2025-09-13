import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">🔍 What is Phishing?</h1>
      <p className="about-paragraph">
        Phishing is a type of cyber attack in which threat actors attempt to deceive users into revealing sensitive personal information like passwords, credit card or banking information, or other personal information that can be weaponized in subsequent attacks.  While threat actors use a wide array of tools and tactics in constructing their phishing campaigns, there are three 
        primary methods used for stealing information:
        </p>
      
        <h1 clasName="about-service">Phishing as a Service</h1>
        < p className="about-paragraph">
       Traditionally, phishing attacks were exclusive to the more tech savvy and skilled cybercriminals, requiring in-depth knowledge of coding, scripting, social engineering, and other techniques. However, over the last several years, we have witnessed the evolution of Phishing-as-a-Service (PaaS) which essentially removes those technical barriers by offering ready-made templates and user-friendly interfaces to simplify the entire process into a point-and-click operation.

Phishing as a Service represents the commoditization and democratization of phishing tools, transforming them from specialized instruments into commercial products. These are no longer hidden in the shadows but are openly available for purchase or rent, sometimes even in legal and accessible markets. The unprecedented ease of access to these tools means that aspiring cybercriminals, without the need to master coding or network infiltration, can launch effective phishing attacks. PaaS platforms provide pre-made phishing campaigns that can be easily customized and deployed by anyone willing to engage in cyber fraud. These platforms may come with customer support, tutorials, and updates, making it all the more accessible to the masses. The transformation is akin to turning a specialist’s toolkit into a consumer product, and its implications are as profound as they are concerning.
      </p>
      <h1 className="about-attack">Types of Phishing Attacks</h1>
      <p className="about-paragraph">
       In its original and most common form, the attack is initiated via an email purporting to be from a reputable or legitimate source, enticing the victim to react by clicking a link to a fraudulent page used for credential harvesting.  As is the case with all cyber threats, these attacks have evolved and adapted to take advantage of the latest advances in technology to compromise more victims as well as to evade phishing detection.  Understanding the different types of attacks is crucial to ensuring any phishing detection solutions put in place will have the capability to identify each of the different types of attacks.  Below is a range of different attack types that we see in the threat landscape.

Angler Phishing.  Angler phishing is a phishing attack that targets victims through social media by impersonating customer service or support agents. Attackers create fake social media accounts for top brands to trick dissatisfied customers into revealing personal information when they are redirected from social media sites to phishing sites, and asked to complete tasks that compromise their personal information.  Financial institutions are often targeted in this type of attack. 

Business Email Compromise (BEC). BEC is a highly targeted spear phishing attack that relies on name recognition to convince targeted victims to complete the request. BEC begins with relatively simple hacking or spoofing of email accounts belonging to key executives like the CEO, CFO, or other roles with financial authority, where the attacker then sends requests for wire payments to fraudulent bank accounts.  Frequently, BEC involved compromised vendor emails, requests for W-2 information, or requests for large amounts of gift cards.  

Clone Phishing.  Clone phishing is an email-based attack where attackers duplicate a legitimate email and replace the original attachments with malware.  As the victim receives a reply to a genuine email, basic phishing detection tools like email filters fail to catch this type of attack because it is sent from a legitimate user and uses legitimate channels. Unlike traditional phishing attacks, clone phishing does not require email spoofing because it is often sent from an actual, legitimate email address.

Content Injection.  Also called content spoofing, arbitrary text injection, or virtual defacement, content injection is an attack that targets users by an injection vulnerability in a web application.  In this type of attack, the threat actor is able to modify a legitimate domain’s page to display a modified version to the user.  A valid web page is created using the attacker’s malicious recommendation and the user believes the recommendation was from the stock website.  Frequently used in social engineering attacks, content injection exploits both a user’s trust as well as a code-based vulnerability.  

Domain Spoofing.  Domain spoofing, also known as website spoofing, is a type of phishing where an attacker replicates a legitimate organization’s domain. They may create false domain names that appear to be legitimate or slightly alter legitimate domain names to trick users.   Attackers often use logos, branding, and visual designs taken from a legitimate domain to create the spoofed website intended to harvest sensitive data from victims who believe they are visiting the legitimate website.  

Evil-Twin Wi-Fi.  An evil-twin attack is when a threat actor stands up a fake Wi-Fi access point to get users to connect, passing through the attacker’s access point rather than a legitimate one.  The attacker gains control of the data shared between the user and the network by directing it to a server under their control. The attacker can easily create an evil twin using common software and a smartphone or other internet-capable device. These attacks are prevalent on unsecured public Wi-Fi networks like coffee shops, airports, libraries, etc., as they allow attackers to capture any login details or other sensitive information from users connected to the fake Wi-Fi access point.

HTTPs Phishing.  It used to be that sites using HTTPS vs. HTTP were assumed to be generally safe, and phishing detection tools could easily distinguish between the safe and unsafe sites.  However, that is no longer the case, as more than half of phishing sites have been observed using https. There are several types of HTTPS phishing, the most common of which are listed below.  

Man-in-the-Middle (MiTM) is where an attacker compromises the communication between two parties while the data is en route. The hacker then impersonates one or both parties to intercept sensitive and confidential information before relaying information on to the intended destination. Though the hacker maintains the ability to alter or inject communications into the pathway, typically the hacker receives and relays most communications unaltered to its intended destination—so as to not be detected.
SSL Stripping is a type of MiTM attack where the attacker downgrades a secure HTTPS connection to an unencrypted HTTP connection by removing the encryption layer, making it vulnerable to eavesdropping and data theft.
Wildcard Certificate attacks are when threat actors are able to access a wildcard certificate, either by stealing a private key or by deceiving a certification authority into issuing the certificate to a fake company.  Once an attacker has this certificate, it can be used to impersonate any subdomain of the legitimate domain. 
Image Phishing.  Image phishing is a type of email phishing attack that uses images to deceive users into clicking on malicious links. This method is gaining popularity because the various obfuscation techniques on the images, such as stretching, color change, compression, and noise addition, make it more difficult for phishing detection solutions to identify. They store the entire visual content of the email in a PNG or JPG file hosted remotely on reputable domains like Wikipedia or Google. By doing this, the attacker can bypass the filter’s reputation scan, making it difficult to analyze textual content placed on the image, which may conceal suspicious keywords or language.

Pharming.  Pharming is a type of phishing attack that redirects web traffic to a location or website different from what was intended by the user.  Attackers can alter the host file on a victim’s computer or exploit a weakness in DNS software, enabling them to reroute internet requests and traffic.  Attackers can also compromise DNS servers which allows them to override DNS data and redirect traffic to an unintended site.  

Pop-Up Phishing.  Pop-up phishing is when users are browsing the web and a fraudulent pop up message appears, informing them that their device has been infected by a virus.  These pop-up ads use scare tactics to trick users into installing malware on their computers, calling fake support numbers, or purchasing antivirus protection that they may not need.  

Search Engine Phishing.  Search Engine Phishing, also known as SEO poisoning, or SEO Trojans, are a type of phishing attack where the threat actors manipulate search engine results in order to appear as the top hit. When users click on the link from the search results, they are redirected to the attacker’s site, which is designed to steal their personal information. 

Smishing – Short for SMS Phishing, Smishing occurs when the attacker tricks the user into clicking a link, disclosing sensitive information, or downloading a trojan, virus, or other piece of malware using the text—or SMS—features on their cellular phone or mobile device. 
      </p>
    </div>
  );
};

export default About;
