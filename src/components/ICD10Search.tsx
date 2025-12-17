import { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from './ui/utils';

// Mock ICD-10 codes database - in production this would come from an API
const icd10Codes = [
  { code: 'R07.9', description: 'Chest pain, unspecified' },
  { code: 'R07.89', description: 'Other chest pain' },
  { code: 'I21.9', description: 'Acute myocardial infarction, unspecified' },
  { code: 'I63.9', description: 'Cerebral infarction, unspecified' },
  { code: 'I64', description: 'Stroke, not specified as hemorrhage or infarction' },
  { code: 'R06.00', description: 'Dyspnea, unspecified' },
  { code: 'R06.02', description: 'Shortness of breath' },
  { code: 'J96.90', description: 'Respiratory failure, unspecified' },
  { code: 'S06.9X0A', description: 'Unspecified intracranial injury without loss of consciousness, initial encounter' },
  { code: 'S72.001A', description: 'Fracture of unspecified part of neck of right femur, initial encounter' },
  { code: 'T14.90XA', description: 'Injury, unspecified, initial encounter' },
  { code: 'R55', description: 'Syncope and collapse' },
  { code: 'R51', description: 'Headache' },
  { code: 'R10.9', description: 'Unspecified abdominal pain' },
  { code: 'R11.0', description: 'Nausea' },
  { code: 'R11.10', description: 'Vomiting, unspecified' },
  { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
  { code: 'E11.65', description: 'Type 2 diabetes mellitus with hyperglycemia' },
  { code: 'E11.641', description: 'Type 2 diabetes mellitus with hypoglycemia with coma' },
  { code: 'J44.1', description: 'Chronic obstructive pulmonary disease with acute exacerbation' },
  { code: 'I50.9', description: 'Heart failure, unspecified' },
  { code: 'I48.91', description: 'Unspecified atrial fibrillation' },
  { code: 'I10', description: 'Essential (primary) hypertension' },
  { code: 'G40.909', description: 'Epilepsy, unspecified, not intractable, without status epilepticus' },
  { code: 'F10.929', description: 'Alcohol use, unspecified with intoxication, unspecified' },
  { code: 'T40.1X1A', description: 'Poisoning by heroin, accidental, initial encounter' },
  { code: 'T40.2X1A', description: 'Poisoning by other opioids, accidental, initial encounter' },
  { code: 'R41.0', description: 'Disorientation, unspecified' },
  { code: 'F41.9', description: 'Anxiety disorder, unspecified' },
  { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
  { code: 'T78.2XXA', description: 'Anaphylactic shock, unspecified, initial encounter' },
  { code: 'W19.XXXA', description: 'Unspecified fall, initial encounter' },
  { code: 'V89.2XXA', description: 'Person injured in unspecified motor-vehicle accident, traffic, initial encounter' },
  { code: 'T75.1XXA', description: 'Unspecified effects of drowning and nonfatal submersion, initial encounter' },
  { code: 'T67.0XXA', description: 'Heatstroke and sunstroke, initial encounter' },
  { code: 'T68.XXXA', description: 'Hypothermia, initial encounter' },
];

interface ICD10SearchProps {
  value: string;
  onChange: (code: string) => void;
}

export default function ICD10Search({ value, onChange }: ICD10SearchProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCodes, setFilteredCodes] = useState(icd10Codes);

  useEffect(() => {
    if (searchQuery) {
      const filtered = icd10Codes.filter(
        (item) =>
          item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCodes(filtered);
    } else {
      setFilteredCodes(icd10Codes);
    }
  }, [searchQuery]);

  const selectedCode = icd10Codes.find((code) => code.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCode
            ? `${selectedCode.code} - ${selectedCode.description}`
            : "Search ICD-10 codes..."}
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
            <CommandEmpty>No ICD-10 code found.</CommandEmpty>
            <CommandGroup>
              {filteredCodes.map((code) => (
                <CommandItem
                  key={code.code}
                  value={code.code}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === code.code ? "opacity-100" : "opacity-0"
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
  );
}
