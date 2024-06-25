import Navbar from '@/components/Navbar.tsx'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
// import { toast } from '@/components/ui/use-toast'
import { useSettingsStore } from '@/components/store'

const FormSchema = z.object({
  severe_weather: z.boolean().default(false).optional(),
})

export function SwitchForm() {
  const setSevereWeather = useSettingsStore((state) => state.setSevereWeather)
  // const severeWeather = useSettingsStore((state) => state.severeWeather)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      severe_weather: true,
    },
  })

  // Define an onSubmit handler
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    // Perform any action you want with the form data
    console.log('Form submitted with data:', data)
    if (data.severe_weather?.valueOf) setSevereWeather(true)
    else setSevereWeather(false)
    // You can add more actions here, such as API calls or displaying a message
  }

  // Handler for switch toggle
  const handleSwitchChange = (field: any, value: boolean) => {
    field.onChange(value)
    console.log(field.name, 'Switch toggled:', value)
    // You can add more actions here
  }

  return (
    <Form {...form}>
      <form className="w-full space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <h3 className="m-5 text-[2rem] font-semibold italic">
            Notifications
          </h3>
          <div className="">
            <FormField
              control={form.control}
              name="severe_weather"
              render={({ field }: any) => (
                <FormItem className="mx-2 flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="">
                    <FormLabel className="text-base">
                      Severe Weather Alerts
                    </FormLabel>
                    <FormDescription>
                      Receive severe weather notifications for your area
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) =>
                        handleSwitchChange(field, value)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit" className="ml-2">
          Save Changes
        </Button>
      </form>
      <Navbar selected="settings" />
    </Form>
  )
}

const SettingsPage = () => {
  return <SwitchForm />
}

export default SettingsPage
