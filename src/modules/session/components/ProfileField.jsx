export const ProfileField = ({ type, name, label, value, onChange, disabled, required, options = [], error }) => {
   return (
      <div className="ProfileField">
         <label className="ProfileField__label">{ label }</label>
         
         {type === 'select' ? (
            <select
               className={`ProfileField__select ${error ? 'ProfileField__select--error' : ''}`}
               name={ name }
               value={ value }
               onChange={ onChange }
               disabled={ disabled }
               required={ required }
            >
               <option value="">Seleccionar...</option>
               {options.map((opt) => (
                  <option key={ opt.value } value={ opt.value }>
                     { opt.label }
                  </option>
               ))}
            </select>
         ) : type === 'date' ? (
            <input
               type="date"
               className={`ProfileField__input ${error ? 'ProfileField__input--error' : ''}`}
               name={ name }
               value={ value }
               onChange={ onChange }
               disabled={ disabled }
               required={ required }
            />
         ) : (
            <input
               type={ type }
               className={`ProfileField__input ${error ? 'ProfileField__input--error' : ''} ${disabled ? 'ProfileField__input--disabled' : ''}`}
               name={ name }
               value={ value }
               onChange={ onChange }
               readOnly={ disabled }
               disabled={ disabled }
               required={ required }
            />
         )}
         {error && <span className="ProfileField__error">{error}</span>}
      </div>
   );
};