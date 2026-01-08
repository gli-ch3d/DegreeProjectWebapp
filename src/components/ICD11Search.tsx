import { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from './ui/utils';
import { Badge } from './ui/badge';

// Mock ICD-11 codes database - in production this would come from an API
const icd11Codes = [
  { code: 'MD11.9', description: 'Chest pain, unspecified' },
  { code: 'MD11.0', description: 'Acute chest pain' },
  { code: 'BA41.Z', description: 'Acute myocardial infarction, unspecified' },
  { code: 'BA40.0', description: 'ST elevation myocardial infarction' },
  { code: '8B11.1', description: 'Ischaemic stroke' },
  { code: '8B20', description: 'Stroke not known if ischaemic or haemorrhagic' },
  { code: 'MD11.1', description: 'Dyspnoea' },
  { code: 'MD11.2', description: 'Shortness of breath' },
  { code: 'CB41.0', description: 'Acute respiratory failure' },
  { code: 'NA07.9', description: 'Traumatic brain injury, unspecified' },
  { code: 'NF02.3', description: 'Fracture of neck of femur' },
  { code: 'NB00', description: 'Injury to unspecified body region' },
  { code: 'MB48.2', description: 'Syncope' },
  { code: 'MB40.0', description: 'Collapse' },
  { code: '8A80.2', description: 'Headache, unspecified' },
  { code: 'MD30.0', description: 'Abdominal pain, unspecified' },
  { code: 'MD40.0', description: 'Nausea' },
  { code: 'MD40.1', description: 'Vomiting, unspecified' },
  { code: '5A10', description: 'Type 2 diabetes mellitus' },
  { code: '5A10.1', description: 'Type 2 diabetes mellitus with hyperglycaemia' },
  { code: '5A10.2', description: 'Type 2 diabetes mellitus with hypoglycaemia' },
  { code: 'CA22.0', description: 'Chronic obstructive pulmonary disease with acute exacerbation' },
  { code: 'BD10.Z', description: 'Heart failure, unspecified' },
  { code: 'BC61.0', description: 'Atrial fibrillation' },
  { code: 'BA00', description: 'Essential hypertension' },
  { code: '8A60.0', description: 'Epilepsy, unspecified' },
  { code: '6C40.1', description: 'Harmful pattern of use of alcohol' },
  { code: 'NE10.0', description: 'Poisoning by opioids' },
  { code: 'NE10.1', description: 'Poisoning by heroin' },
  { code: 'MB23.2', description: 'Disorientation' },
  { code: '6B00', description: 'Generalised anxiety disorder' },
  { code: '6A70', description: 'Single episode depressive disorder' },
  { code: '4A84.0', description: 'Anaphylaxis' },
  { code: 'NC50', description: 'Fall from unspecified height' },
  { code: 'NI00', description: 'Injury in transport accident' },
  { code: 'NI20.0', description: 'Injury in motor vehicle traffic accident' },
  { code: 'NF50', description: 'Drowning or nonfatal submersion' },
  { code: 'NF01', description: 'Effects of heat and light' },
  { code: 'NF02.0', description: 'Heatstroke' },
  { code: 'NF03', description: 'Hypothermia' },
  { code: 'NA00', description: 'Head injury' },
  { code: 'NA20', description: 'Injury to neck' },
  { code: 'ND60', description: 'Burn of unspecified body region' },
  { code: 'ND61', description: 'Burn of first degree' },
  { code: 'ND62', description: 'Burn of second degree' },
  { code: 'ND63', description: 'Burn of third degree' },
  { code: 'NE60', description: 'Poisoning by medications' },
  { code: 'NE61', description: 'Toxic effect of substances' },
];

interface ICD11SearchProps {
  values: string[];
  onChange: (codes: string[]) => void;
  onRemove: (code: string) => void;
}

export default function ICD11Search({ values, onChange, onRemove }: ICD11SearchProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCodes, setFilteredCodes] = useState(icd11Codes);

  useEffect(() => {
    if (searchQuery) {
      const filtered = icd11Codes.filter(
        (item) =>
          item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCodes(filtered);
    } else {
      setFilteredCodes(icd11Codes);
    }
  }, [searchQuery]);

  const handleSelect = (code: string) => {
    if (values.includes(code)) {
      // Remove if already selected
      onChange(values.filter(v => v !== code));
    } else {
      // Add to selection
      onChange([...values, code]);
    }
  };

  const selectedCodesDisplay = values.length > 0
    ? `${values.length} code${values.length > 1 ? 's' : ''} selected`
    : "Search ICD-11 codes...";

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCodesDisplay}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[600px] p-0">
          <Command>
            <CommandInput 
              placeholder="Search by code or description..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>No ICD-11 code found.</CommandEmpty>
              <CommandGroup>
                {filteredCodes.map((code) => (
                  <CommandItem
                    key={code.code}
                    value={code.code}
                    onSelect={() => handleSelect(code.code)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        values.includes(code.code) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{code.code}</span>
                      <span className="text-sm text-muted-foreground">
                        {code.description}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected codes display */}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((code) => {
            const codeInfo = icd11Codes.find(c => c.code === code);
            return (
              <Badge key={code} variant="secondary" className="gap-1 pr-1">
                <span className="font-mono">{code}</span>
                {codeInfo && <span className="text-xs">- {codeInfo.description}</span>}
                <button
                  onClick={() => onRemove(code)}
                  className="ml-1 rounded-sm hover:bg-muted p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}