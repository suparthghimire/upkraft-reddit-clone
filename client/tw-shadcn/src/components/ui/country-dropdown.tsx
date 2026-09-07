"use client"

import { COUNTRIES, type Country } from "@/pages/form/_utils/countries";
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox"

function getCountryFlagUrl(alpha2: string) {
  return `https://flagcdn.com/w40/${alpha2.toLowerCase()}.png`;
}

export function ComboboxPopup({ value, onChange }: { value: string| null; onChange: (value: string) => void }) {
  

const selectedCountry:Country | null = COUNTRIES.find((country) => country["alpha-2"] === value) || null;
  return (
    <Combobox 
      items={COUNTRIES} 
      value={selectedCountry}
      itemToStringValue={(country: Country) => country.name}
      onValueChange={(country) => {
        if (country) {
          onChange(country["alpha-2"]);
        }
      }}
    >
      <ComboboxTrigger 
        render={
          <Button variant="outline" className="w-full justify-between font-normal">
            <ComboboxValue>
              {selectedCountry && (
                <img
                  src={getCountryFlagUrl(selectedCountry["alpha-2"])}
                  alt=""
                  className="mr-2 h-4 w-5 inline-block shrink-0 rounded-sm object-cover align-middle mb-0.5"
                />
              )}
              {selectedCountry ? selectedCountry.name : "Select a country..."}
            </ComboboxValue>
          </Button>
        } 
      />
      <ComboboxContent>
        <ComboboxInput showTrigger={false} placeholder="Search country..." />
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item: Country) => (
            <ComboboxItem key={item["alpha-2"]} value={item}>
              <img
                src={getCountryFlagUrl(item["alpha-2"])}
                alt={item["alpha-2"]}
                aria-hidden="true"
                className="h-4 w-5 shrink-0 rounded-sm object-cover"
              />
              {item.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
