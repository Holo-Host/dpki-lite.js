<a name="Keypair"></a>

## Keypair
Represents two asymmetric cryptography keypairs
- a signing keypair
- an encryption keypair

base64url encoded identity string to represent the public sides

can optionally be initialized without the private halves of the pairs

**Kind**: global class  

* [Keypair](#Keypair)
    * [new Keypair(opt)](#new_Keypair_new)
    * _instance_
        * [.getId()](#Keypair+getId) ⇒ <code>string</code>
        * [.sign(data)](#Keypair+sign)
        * [.verify(signature, data)](#Keypair+verify)
        * [.encrypt(recipientIds, data)](#Keypair+encrypt) ⇒ <code>Buffer</code>
        * [.decrypt(sourceId, cipher)](#Keypair+decrypt) ⇒ <code>Buffer</code>
        * [.getBundle(passphrase, hint)](#Keypair+getBundle)
    * _static_
        * [.newFromSeed(seed)](#Keypair.newFromSeed)
        * [.fromBundle(bundle, passphrase)](#Keypair.fromBundle)

<a name="new_Keypair_new"></a>

### new Keypair(opt)
keypair constructor (you probably want one of the static functions above)


| Param | Type | Description |
| --- | --- | --- |
| opt | <code>object</code> |  |
| opt.pubkeys | <code>string</code> | the keypair identity string |
| [opt.signPriv] | <code>Buffer</code> | private signature key |
| [opt.encPriv] | <code>Buffer</code> | private encryption key |

<a name="Keypair+getId"></a>

### keypair.getId() ⇒ <code>string</code>
get the keypair identifier string

**Kind**: instance method of [<code>Keypair</code>](#Keypair)  
<a name="Keypair+sign"></a>

### keypair.sign(data)
sign some arbitrary data with the signing private key

**Kind**: instance method of [<code>Keypair</code>](#Keypair)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Buffer</code> | the data to sign |

<a name="Keypair+verify"></a>

### keypair.verify(signature, data)
verify data that was signed with our private signing key

**Kind**: instance method of [<code>Keypair</code>](#Keypair)  

| Param | Type |
| --- | --- |
| signature | <code>Buffer</code> | 
| data | <code>Buffer</code> | 

<a name="Keypair+encrypt"></a>

### keypair.encrypt(recipientIds, data) ⇒ <code>Buffer</code>
encrypt arbitrary data to be readale by potentially multiple recipients

**Kind**: instance method of [<code>Keypair</code>](#Keypair)  

| Param | Type | Description |
| --- | --- | --- |
| recipientIds | <code>array.&lt;string&gt;</code> | multiple recipient identifier strings |
| data | <code>Buffer</code> | the data to encrypt |

<a name="Keypair+decrypt"></a>

### keypair.decrypt(sourceId, cipher) ⇒ <code>Buffer</code>
attempt to decrypt the cipher buffer (assuming it was targeting us)

**Kind**: instance method of [<code>Keypair</code>](#Keypair)  
**Returns**: <code>Buffer</code> - - the decrypted data  

| Param | Type | Description |
| --- | --- | --- |
| sourceId | <code>string</code> | identifier string of who encrypted this data |
| cipher | <code>Buffer</code> | the encrypted data |

<a name="Keypair+getBundle"></a>

### keypair.getBundle(passphrase, hint)
generate an encrypted persistence bundle

**Kind**: instance method of [<code>Keypair</code>](#Keypair)  

| Param | Type | Description |
| --- | --- | --- |
| passphrase | <code>string</code> | the encryption passphrase |
| hint | <code>string</code> | additional info / description for the bundle |

<a name="Keypair.newFromSeed"></a>

### Keypair.newFromSeed(seed)
derive the pairs from a 32 byte seed buffer

**Kind**: static method of [<code>Keypair</code>](#Keypair)  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>Buffer</code> | the seed buffer |

<a name="Keypair.fromBundle"></a>

### Keypair.fromBundle(bundle, passphrase)
initialize the pairs from an encrypted persistence bundle

**Kind**: static method of [<code>Keypair</code>](#Keypair)  

| Param | Type | Description |
| --- | --- | --- |
| bundle | <code>object</code> | persistence info |
| passphrase | <code>string</code> | decryption passphrase |

