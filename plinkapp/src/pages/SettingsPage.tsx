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
import { toast } from '@/components/ui/use-toast'

const FormSchema = z.object({
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
})

export function SwitchForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      security_emails: true,
    },
  })

  return (
    <Form {...form}>
      <form className="w-full space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium">Notifications</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="marketing_emails"
              render={({ field }: any) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
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
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
      <Navbar selected="settings" />
    </Form>
  )
}

const SettingsPage = () => {
  return <SwitchForm />
}

export default SettingsPage
