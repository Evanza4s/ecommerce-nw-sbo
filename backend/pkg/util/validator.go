package util

import (
	"fmt"

	"github.com/go-playground/locales/en"
	"github.com/go-playground/locales/id"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	en_translations "github.com/go-playground/validator/v10/translations/en"
	id_translations "github.com/go-playground/validator/v10/translations/id"
	"github.com/google/uuid"
)

type CustomValidator struct {
	Validator *validator.Validate
}

func (cv *CustomValidator) Validate(i interface{}) error {
	return cv.Validator.Struct(i)
}

func ValidateUUID(fl validator.FieldLevel) bool {
	if value, ok := fl.Field().Interface().(uuid.UUID); ok {
		uuidPtr := &value
		return uuidPtr != nil && uuidPtr.String() != ""
	}
	return false
}

func TranslateError(err error, trans ut.Translator) (errs []error) {
	if err == nil {
		return nil
	}
	validatorErrs := err.(validator.ValidationErrors)
	for _, e := range validatorErrs {
		translatedErr := fmt.Errorf(e.Translate(trans))
		errs = append(errs, translatedErr)
	}
	return errs
}

func Translator(local string, validate *validator.Validate) (translator ut.Translator) {
	switch local {
	case "id":
		idTrans := id.New()
		uni := ut.New(idTrans, idTrans)
		trans, _ := uni.GetTranslator("id")
		id_translations.RegisterDefaultTranslations(validate, trans)
		translator = trans
	case "en":
		enTrans := en.New()
		uni := ut.New(enTrans, enTrans)
		trans, _ := uni.GetTranslator("en")
		en_translations.RegisterDefaultTranslations(validate, trans)
		translator = trans
	default:
		enTrans := en.New()
		uni := ut.New(enTrans, enTrans)
		trans, _ := uni.GetTranslator("en")
		en_translations.RegisterDefaultTranslations(validate, trans)
		translator = trans
	}

	return translator
}
