import { FIELDS, FIELD_LABELS } from "@/constants";
import { Field } from "@/types";

interface FieldSelectorProps {
  selectedFields: Field[];
  onFieldChange: (field: Field) => void;
}

export const FieldSelector = ({ selectedFields, onFieldChange }: FieldSelectorProps) => {
  return (
    <div className="mb-6 space-y-4">
      <p className="text-lg font-semibold mb-3 text-gray-600">
        出題分野を選択してください:
      </p>
      {FIELDS.map((field) => (
        <div key={field} className="flex items-center">
          <input
            type="checkbox"
            id={field}
            checked={selectedFields.includes(field)}
            onChange={() => onFieldChange(field)}
            className="mr-3 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
          />
          <label
            htmlFor={field}
            className="text-base sm:text-lg text-gray-600 capitalize"
          >
            {FIELD_LABELS[field]}
          </label>
        </div>
      ))}
    </div>
  );
};
