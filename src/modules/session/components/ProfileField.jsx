export const ProfileField = ({ type, name, label, value, onChange, disabled, required, options = [] }) => {
   return (
      <div className="ProfileField">
         <label className="ProfileField__label">{ label }</label>
         
         {type === 'select' ? (
            <select
               className="ProfileField__select"
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
               className="ProfileField__input"
               name={ name }
               value={ value }
               onChange={ onChange }
               disabled={ disabled }
               required={ required }
            />
         ) : (
            <input
               type={ type }
               className="form__input-field ProfileField__text-input"
               name={ name }
               value={ value }
               onChange={ onChange }
               readOnly={ disabled }
               disabled={ false }
               required={ required }
            />
         )}
      </div>
   );
};