package crypto

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"fmt"
	"os"
	"strings"

	"github.com/youmark/pkcs8"
)

var (
	publicKey  *rsa.PublicKey
	privateKey *rsa.PrivateKey
)

func Init() {
	publicKeyBytes, err := os.ReadFile("public_key.pem")
	if err != nil {
		panic(fmt.Errorf("failed to read public key file: %v", err))
	}

	publicKeyBlock, _ := pem.Decode(publicKeyBytes)
	if publicKeyBlock == nil {
		panic("Failed to decode public key PEM block")
	}

	// Try PKCS#1 first, fallback to PKIX
	publicKey, err = x509.ParsePKCS1PublicKey(publicKeyBlock.Bytes)
	if err != nil {
		parsed, e := x509.ParsePKIXPublicKey(publicKeyBlock.Bytes)
		if e != nil {
			panic(fmt.Errorf("failed to parse public key (tried PKCS1 and PKIX): %v", e))
		}
		var ok bool
		publicKey, ok = parsed.(*rsa.PublicKey)
		if !ok {
			panic("public key is not RSA")
		}
	}

	// Read private key from PEM file
	privateKeyBytes, err := os.ReadFile("private_key.pem")
	if err != nil {
		panic(fmt.Errorf("failed to read private key file: %v", err))
	}

	privateKeyBlock, _ := pem.Decode(privateKeyBytes)
	if privateKeyBlock == nil {
		panic("Failed to decode private key PEM block")
	}

	isEncrypted := strings.Contains(privateKeyBlock.Type, "ENCRYPTED")

	if isEncrypted {
		// Use pkcs8 library for PBES2 encrypted keys
		passphrase := os.Getenv("RSA_PASSPHRASE")
		if passphrase == "" {
			passphrase = os.Getenv("ENCRYPTION_KEY")
		}

		parsed, e := pkcs8.ParsePKCS8PrivateKey(privateKeyBlock.Bytes, []byte(passphrase))
		if e != nil {
			panic(fmt.Errorf("failed to decrypt/parse encrypted private key: %v", e))
		}
		var ok bool
		privateKey, ok = parsed.(*rsa.PrivateKey)
		if !ok {
			panic("private key is not RSA")
		}
	} else {
		// Unencrypted key: try PKCS#1 then PKCS#8
		privateKey, err = x509.ParsePKCS1PrivateKey(privateKeyBlock.Bytes)
		if err != nil {
			parsed, e := x509.ParsePKCS8PrivateKey(privateKeyBlock.Bytes)
			if e != nil {
				panic(fmt.Errorf("failed to parse private key (tried PKCS1 and PKCS8): %v", e))
			}
			var ok bool
			privateKey, ok = parsed.(*rsa.PrivateKey)
			if !ok {
				panic("private key is not RSA")
			}
		}
	}
}

func RsaEncrypt(payload []byte) string {
	encrypted, err := rsa.EncryptPKCS1v15(rand.Reader, publicKey, payload)
	if err != nil {
		panic(fmt.Errorf("failed to encrypt payload: %s", err))
	}

	return base64.StdEncoding.EncodeToString(encrypted)
}

func RsaDecrypt(ciphertext string) string {
	ct, _ := base64.StdEncoding.DecodeString(ciphertext)
	decrypted, err := rsa.DecryptPKCS1v15(rand.Reader, privateKey, ct)
	if err != nil {
		panic(fmt.Errorf("failed to decrypt payload: %s", err))
	}

	return string(decrypted)
}
