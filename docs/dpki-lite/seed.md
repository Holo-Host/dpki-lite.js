## Classes

<dl>
<dt><a href="#Seed">Seed</a></dt>
<dd><p>Superclass of all other seed types</p>
</dd>
<dt><a href="#DevicePinSeed">DevicePinSeed</a></dt>
<dd><p>This is a device seed that has been PIN derived</p>
</dd>
<dt><a href="#RootSeed">RootSeed</a></dt>
<dd><p>This root seed should be pure entropy</p>
</dd>
</dl>

<a name="Seed"></a>

## Seed
Superclass of all other seed types

**Kind**: global class  

* [Seed](#Seed)
    * [new Seed(type, seed)](#new_Seed_new)
    * _instance_
        * [.getBundle(passphrase, hint)](#Seed+getBundle)
        * [.getMnemonic()](#Seed+getMnemonic)
    * _static_
        * [.fromBundle(bundle, passphrase)](#Seed.fromBundle) ⇒ [<code>RootSeed</code>](#RootSeed) \| <code>DeviceSeed</code> \| [<code>DevicePinSeed</code>](#DevicePinSeed)

<a name="new_Seed_new"></a>

### new Seed(type, seed)
Initialize this seed class with persistence bundle type and private seed


| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | the persistence bundle type |
| seed | <code>Buffer</code> \| <code>string</code> | the private seed data (as a buffer or mnemonic) |

<a name="Seed+getBundle"></a>

### seed.getBundle(passphrase, hint)
generate a persistence bundle with hint info

**Kind**: instance method of [<code>Seed</code>](#Seed)  

| Param | Type | Description |
| --- | --- | --- |
| passphrase | <code>string</code> | the encryption passphrase |
| hint | <code>string</code> | additional info / description for persistence |

<a name="Seed+getMnemonic"></a>

### seed.getMnemonic()
generate a bip39 mnemonic based on the private seed entroyp

**Kind**: instance method of [<code>Seed</code>](#Seed)  
<a name="Seed.fromBundle"></a>

### Seed.fromBundle(bundle, passphrase) ⇒ [<code>RootSeed</code>](#RootSeed) \| <code>DeviceSeed</code> \| [<code>DevicePinSeed</code>](#DevicePinSeed)
Get the proper seed type from a persistence bundle

**Kind**: static method of [<code>Seed</code>](#Seed)  

| Param | Type | Description |
| --- | --- | --- |
| bundle | <code>object</code> | the persistence bundle |
| passphrase | <code>string</code> | the decryption passphrase |

<a name="DevicePinSeed"></a>

## DevicePinSeed
This is a device seed that has been PIN derived

**Kind**: global class  

* [DevicePinSeed](#DevicePinSeed)
    * [new DevicePinSeed()](#new_DevicePinSeed_new)
    * [.getApplicationKeypair(index)](#DevicePinSeed+getApplicationKeypair) ⇒ <code>Keypair</code>

<a name="new_DevicePinSeed_new"></a>

### new DevicePinSeed()
delegate to base class

<a name="DevicePinSeed+getApplicationKeypair"></a>

### devicePinSeed.getApplicationKeypair(index) ⇒ <code>Keypair</code>
generate an application keypair given an index based on this seed

**Kind**: instance method of [<code>DevicePinSeed</code>](#DevicePinSeed)  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

<a name="RootSeed"></a>

## RootSeed
This root seed should be pure entropy

**Kind**: global class  

* [RootSeed](#RootSeed)
    * [new RootSeed()](#new_RootSeed_new)
    * _instance_
        * [.getDevicePinSeed(pin)](#RootSeed+getDevicePinSeed) ⇒ [<code>DevicePinSeed</code>](#DevicePinSeed)
    * _static_
        * [.newRandom()](#RootSeed.newRandom)

<a name="new_RootSeed_new"></a>

### new RootSeed()
delegate to base class

<a name="RootSeed+getDevicePinSeed"></a>

### rootSeed.getDevicePinSeed(pin) ⇒ [<code>DevicePinSeed</code>](#DevicePinSeed)
generate a device pin seed by applying pwhash of pin with this seed as the salt

**Kind**: instance method of [<code>RootSeed</code>](#RootSeed)  

| Param | Type | Description |
| --- | --- | --- |
| pin | <code>string</code> | should be >= 4 characters 1-9 |

<a name="RootSeed.newRandom"></a>

### RootSeed.newRandom()
Get a new, completely random root seed

**Kind**: static method of [<code>RootSeed</code>](#RootSeed)  
